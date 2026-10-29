import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
type PayMongoPayment = {
    id?: string;
    attributes?: {
        status?: string;
        amount?: number;
        currency?: string;
    };
};
type PayMongoWebhookEvent = {
    data?: {
        id?: string;
        attributes?: {
            livemode?: boolean;
            type?: string;
            data?: {
                id?: string;
                attributes?: {
                    reference_number?: string;
                    payments?: PayMongoPayment[];
                    status?: string;
                    payment_id?: string;
                };
            };
            status?: string;
        };
    };
};
function verifyPayMongoSignature(
    rawBody: string,
    signatureHeader: string | null,
    webhookSecret: string,
    isLiveMode: boolean
): boolean {
    if (!signatureHeader) return false;
    const parts: Record<string, string> = {};
    for (const part of signatureHeader.split(",")) {
        const separator = part.indexOf("=");
        if (separator === -1) continue;
        parts[part.slice(0, separator).trim()] =
            part.slice(separator + 1).trim();
    }

    const timestamp = parts.t;
    const receivedSignature = isLiveMode ? parts.li : parts.te;
    if (!timestamp || !receivedSignature) return false;
    const timestampSeconds = Number(timestamp);
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (!Number.isFinite(timestampSeconds) || Math.abs(nowSeconds - timestampSeconds) > 300) {
        return false;
    }
    const expectedSignature = createHmac("sha256", webhookSecret).update(`${timestamp}.${rawBody}`).digest("hex");
    const expected = Buffer.from(expectedSignature, "hex");
    const received = Buffer.from(receivedSignature, "hex");

    return (
        expected.length === received.length &&
        timingSafeEqual(expected, received)
    );
}

export async function POST(request: Request) {
    const rawBody = await request.text();
    const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;
    const paymongoSecretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!paymongoSecretKey) {
        console.error("PAYMONGO_SECRET_KEY is not configured.");
        return NextResponse.json(
            { error: "Payment configuration is missing." },
            { status: 500 }
        );
    }
    const expectedLiveMode = paymongoSecretKey.startsWith("sk_live_");

    if (!webhookSecret) {
        console.error("PAYMONGO_WEBHOOK_SECRET is not configured.");
        return NextResponse.json(
            { error: "Webhook configuration is missing." },
            { status: 500 }
        );
    }

    let event: PayMongoWebhookEvent;

    try {
        event = JSON.parse(rawBody) as PayMongoWebhookEvent;
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON payload." },
            { status: 400 }
        );
    }
    const eventAttributes = event?.data?.attributes;
    const isLiveMode = eventAttributes?.livemode;
    if (isLiveMode !== expectedLiveMode) {
        return NextResponse.json(
            { error: "Webhook mode does not match server configuration." },
            { status: 401 }
        );
    }

    if (!verifyPayMongoSignature(rawBody, request.headers.get("paymongo-signature"), webhookSecret, isLiveMode)) {
        return NextResponse.json(
            { error: "Invalid webhook signature." },
            { status: 401 }
        );
    }
    const eventType = eventAttributes?.type;

    if (eventType === "payment.refunded" || eventType === "payment.refund.updated") {
        const resource = eventAttributes?.data;
        const resourceId = resource?.id;
        const resourceStatus = resource?.attributes?.status;

        if (typeof resourceId !== "string" || typeof resourceStatus !== "string") {
            console.error("Invalid PayMongo refund webhook payload.", {
                eventType,
            });

            return NextResponse.json(
                { error: "Invalid refund event data." },
                { status: 400 }
            );
        }
        if (eventType === "payment.refunded") {
            if (resourceStatus !== "refunded") {
                return NextResponse.json(
                    { received: true, requiresReview: true },
                    { status: 200 }
                );
            }
            try {
                const booking = await prisma.booking.findUnique({
                    where: { paymongo_payment_id: resourceId },
                    select: {
                        id: true,
                        booking_ref: true,
                        payment_status: true,
                        paymongo_refund_status: true,
                    },
                });
                if (!booking) {
                    console.warn(
                        "No booking matches the refunded PayMongo payment.",
                        { paymentId: resourceId }
                    );
                    return NextResponse.json(
                        { received: true, requiresReview: true },
                        { status: 200 }
                    );
                }

                const result = await prisma.$transaction(async (tx) => {
                    const current = await tx.booking.findUnique({
                        where: { id: booking.id },
                        select: {
                            payment_status: true,
                            paymongo_refund_status: true,
                        },
                    });

                    if (!current) return "NOT_FOUND" as const;

                    if (current.payment_status === "REFUNDED" && current.paymongo_refund_status === "SUCCEEDED") {
                        return "ALREADY_PROCESSED" as const;
                    }

                    const update = await tx.booking.updateMany({
                        where: {
                            id: booking.id,
                            payment_status: current.payment_status,
                            paymongo_refund_status:
                                current.paymongo_refund_status,
                        },
                        data: {
                            payment_status: "REFUNDED",
                            paymongo_refund_status: "SUCCEEDED",
                        },
                    });

                    if (update.count !== 1) {
                        return "CONFLICT" as const;
                    }

                    await tx.bookingAuditLog.create({
                        data: {
                            booking_id: booking.id,
                            actor_type: "PAYMONGO",
                            action: "PAYMENT_REFUNDED",
                            reason:
                                "PayMongo confirmed that the payment was refunded.",
                            previous_data: {
                                payment_status: current.payment_status,
                                paymongo_refund_status:
                                    current.paymongo_refund_status,
                            },
                            new_data: {
                                payment_status: "REFUNDED",
                                paymongo_refund_status: "SUCCEEDED",
                                paymongo_payment_id: resourceId,
                            },
                        },
                    });
                    return "UPDATED" as const;
                });

                if (result === "NOT_FOUND" || result === "CONFLICT") {
                    return NextResponse.json(
                        { received: true, requiresReview: true },
                        { status: 200 }
                    );
                }

                return NextResponse.json(
                    {
                        received: true,
                        paymentId: resourceId,
                        paymentStatus: "REFUNDED",
                        refundStatus: "SUCCEEDED",
                        alreadyProcessed: result === "ALREADY_PROCESSED",
                    },
                    { status: 200 }
                );
            } catch (error) {
                console.error(
                    "PayMongo refunded-payment webhook processing failed:",
                    { paymentId: resourceId, error }
                );
                return NextResponse.json(
                    { error: "Unable to process refunded payment webhook.", },
                    { status: 500 }
                );
            }
        }
        const refundId = resourceId;
        const paymentId = resource?.attributes?.payment_id;

        const statusMap = {
            pending: "PENDING",
            processing: "PROCESSING",
            succeeded: "SUCCEEDED",
            failed: "FAILED",
        } as const;

        if (!Object.hasOwn(statusMap, resourceStatus)) {
            console.warn("Unknown PayMongo refund status.", {
                refundId,
                refundStatus: resourceStatus,
            });
            return NextResponse.json(
                { received: true, requiresReview: true },
                { status: 200 }
            );
        }

        const mappedStatus = statusMap[resourceStatus as keyof typeof statusMap];

        try {
            const booking = await prisma.booking.findFirst({
                where: {
                    OR: [
                        { paymongo_refund_id: refundId },
                        ...(typeof paymentId === "string"
                            ? [{ paymongo_payment_id: paymentId }]
                            : []),
                    ],
                },
                select: {
                    id: true,
                    booking_ref: true,
                },
            });
            if (!booking) {
                console.warn("No booking matches the PayMongo refund event.", {
                    refundId,
                    paymentId,
                });

                return NextResponse.json(
                    { received: true, requiresReview: true },
                    { status: 200 }
                );
            }

            const result = await prisma.$transaction(async (tx) => {
                const current = await tx.booking.findUnique({
                    where: { id: booking.id },
                    select: {
                        paymongo_refund_id: true,
                        paymongo_refund_status: true,
                        payment_status: true,
                    },
                });

                if (!current) return "NOT_FOUND" as const;

                if (current.paymongo_refund_status === "SUCCEEDED") {
                    return "ALREADY_PROCESSED" as const;
                }

                if (current.paymongo_refund_id && current.paymongo_refund_id !== refundId) {
                    return "REFUND_ID_MISMATCH" as const;
                }

                const nextPaymentStatus = mappedStatus === "SUCCEEDED" ? "REFUNDED" : current.payment_status;
                const hasChanges = current.paymongo_refund_id !== refundId || current.paymongo_refund_status !== mappedStatus || current.payment_status !== nextPaymentStatus;

                if (!hasChanges) return "UNCHANGED" as const;

                const update = await tx.booking.updateMany({
                    where: {
                        id: booking.id,
                        paymongo_refund_id: current.paymongo_refund_id,
                        paymongo_refund_status:
                            current.paymongo_refund_status,
                        payment_status: current.payment_status,
                    },
                    data: {
                        paymongo_refund_id: refundId,
                        paymongo_refund_status: mappedStatus,
                        ...(mappedStatus === "SUCCEEDED"
                            ? { payment_status: "REFUNDED" as const }
                            : {}),
                    },
                });

                if (update.count !== 1) return "CONFLICT" as const;

                await tx.bookingAuditLog.create({
                    data: {
                        booking_id: booking.id,
                        actor_type: "PAYMONGO",
                        action: "REFUND_STATUS_UPDATED",
                        reason: `PayMongo refund status changed to ${mappedStatus}.`,
                        previous_data: {
                            paymongo_refund_id: current.paymongo_refund_id,
                            paymongo_refund_status:
                                current.paymongo_refund_status,
                            payment_status: current.payment_status,
                        },
                        new_data: {
                            paymongo_refund_id: refundId,
                            paymongo_refund_status: mappedStatus,
                            payment_status: nextPaymentStatus,
                        },
                    },
                });
                return "UPDATED" as const;
            });

            if (result === "NOT_FOUND" || result === "REFUND_ID_MISMATCH" || result === "CONFLICT") {
                if (result === "REFUND_ID_MISMATCH") {
                    console.error(
                        "PayMongo refund ID does not match the booking record.",
                        { bookingId: booking.id, refundId }
                    );
                }
                return NextResponse.json(
                    { received: true, requiresReview: true },
                    { status: 200 }
                );
            }
            return NextResponse.json(
                {
                    received: true,
                    refundId,
                    refundStatus: mappedStatus,
                    alreadyProcessed:
                        result === "ALREADY_PROCESSED" ||
                        result === "UNCHANGED",
                },
                { status: 200 }
            );
        } catch (error) {
            console.error("PayMongo refund webhook processing failed:", {
                refundId,
                error,
            });

            return NextResponse.json(
                { error: "Unable to process refund webhook." },
                { status: 500 }
            );
        }
    }
    if (eventType !== "checkout_session.payment.paid") {
        return NextResponse.json({ received: true }, { status: 200 });
    }
    if (!eventAttributes) {
        return NextResponse.json(
            { error: "Invalid webhook event data." },
            { status: 400 }
        );
    }
    const session = eventAttributes.data;
    const sessionId = session?.id;
    const attributes = session?.attributes;
    const bookingRef = attributes?.reference_number;
    const payments = attributes?.payments;

    if (typeof sessionId !== "string" || typeof bookingRef !== "string" || !Array.isArray(payments)) {
        return NextResponse.json(
            { error: "Invalid checkout session data." },
            { status: 400 }
        );
    }
    try {
        const booking = await prisma.booking.findFirst({
            where: {
                booking_ref: bookingRef,
                paymongo_session_id: sessionId,
            },
        });
        if (!booking) {
            console.error("No booking matches the paid checkout session.", {
                bookingRef,
                sessionId,
            });
            return NextResponse.json(
                { error: "Booking not found for this payment." },
                { status: 404 }
            );
        }
        if (booking.status === "CONFIRMED" && booking.payment_status === "PAID") {
            return NextResponse.json(
                { received: true, alreadyProcessed: true },
                { status: 200 }
            );
        }

        const paidPayment = payments.find(
            (payment) => payment.attributes?.status === "paid"
        );
        if (!paidPayment) {
            return NextResponse.json(
                { error: "No paid payment was found." },
                { status: 400 }
            );
        }
        if (typeof paidPayment.id !== "string" || paidPayment.id.trim().length === 0) {
            console.error("Paid payment is missing its payment ID.", {
                bookingRef,
                sessionId,
            });
            return NextResponse.json(
                { received: true, requiresReview: true },
                { status: 200 }
            );
        }

        const paidAttributes = paidPayment.attributes;
        const expectedAmount = booking.total * 100;
        const paidAmount = paidAttributes?.amount;
        const paidCurrency = paidAttributes?.currency;
        if (paidAmount !== expectedAmount || typeof paidCurrency !== "string" || paidCurrency.toUpperCase() !== "PHP") {
            console.error("Payment amount or currency mismatch.", {
                bookingRef,
                expectedAmount,
                paidAmount,
                paidCurrency,
            });
            return NextResponse.json(
                { received: true, requiresReview: true },
                { status: 200 }
            );
        }

        if (booking.status !== "PENDING" || booking.payment_status !== "PENDING" || (booking.payment_expires_at !== null && booking.payment_expires_at < new Date())) {
            console.error("Paid event received for an ineligible booking.", {
                bookingRef,
                status: booking.status,
                paymentStatus: booking.payment_status,
            });
            return NextResponse.json(
                { received: true, requiresReview: true },
                { status: 200 }
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            const confirmation = await tx.booking.updateMany({
                where: {
                    id: booking.id,
                    status: "PENDING",
                    payment_status: "PENDING",
                    OR: [
                        { payment_expires_at: null },
                        { payment_expires_at: { gte: new Date() } },
                    ],
                },
                data: {
                    status: "CONFIRMED",
                    payment_status: "PAID",
                    paymongo_payment_id: paidPayment.id,
                },
            });

            if (confirmation.count !== 1) {
                return false;
            }

            await tx.bookingAuditLog.create({
                data: {
                    booking_id: booking.id,
                    actor_type: "PAYMONGO",
                    action: "PAYMENT_CONFIRMED",
                    reason:
                        "PayMongo confirmed the checkout payment; booking eligibility and payment amount were verified.",
                    previous_data: {
                        status: booking.status,
                        payment_status: booking.payment_status,
                        paymongo_payment_id: booking.paymongo_payment_id,
                    },
                    new_data: {
                        status: "CONFIRMED",
                        payment_status: "PAID",
                        paymongo_payment_id: paidPayment.id,
                    },
                },
            });

            return true;
        });

        if (!result) {
            console.warn("Payment received but booking was not confirmed.", {
                bookingRef,
                reason: "Booking state changed or payment deadline passed.",
            });
            return NextResponse.json(
                { received: true, requiresReview: true },
                { status: 200 }
            );
        }
        return NextResponse.json(
            {
                received: true,
                bookingRef,
                status: "CONFIRMED",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("PayMongo webhook processing failed:", error);
        return NextResponse.json(
            { error: "Unable to process payment webhook." },
            { status: 500 }
        );
    }
}