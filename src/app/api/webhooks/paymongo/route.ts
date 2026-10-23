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
    const expectedSignature = createHmac("sha256", webhookSecret)
        .update(`${timestamp}.${rawBody}`)
        .digest("hex");
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
    const isLiveMode = eventAttributes?.livemode === true;
    const validSignature = verifyPayMongoSignature(
        rawBody,
        request.headers.get("paymongo-signature"),
        webhookSecret,
        isLiveMode
    );
    if (!validSignature) {
        return NextResponse.json(
            { error: "Invalid webhook signature." },
            { status: 401 }
        );
    }
    const eventType = eventAttributes?.type;
    if (
        eventType === "payment.refunded" ||
        eventType === "payment.refund.updated"
    ) {
        const resource = eventAttributes?.data;
        const resourceId = resource?.id;
        const resourceStatus = resource?.attributes?.status;

        if (
            typeof resourceId !== "string" ||
            typeof resourceStatus !== "string"
        ) {
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
                await prisma.booking.update({
                    where: { id: booking.id },
                    data: {
                        payment_status: "REFUNDED",
                        paymongo_refund_status: "SUCCEEDED",
                    },
                });
                return NextResponse.json(
                    {
                        received: true,
                        paymentId: resourceId,
                        paymentStatus: "REFUNDED",
                        refundStatus: "SUCCEEDED",
                    },
                    { status: 200 }
                );
            } catch (error) {
                console.error(
                    "PayMongo refunded-payment webhook processing failed:",
                    { paymentId: resourceId, error }
                );
                return NextResponse.json(
                    { error: "Unable to process refunded payment webhook." },
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

        if (!(resourceStatus in statusMap)) {
            console.warn("Unknown PayMongo refund status.", {
                refundId,
                refundStatus: resourceStatus,
            });
            return NextResponse.json(
                { received: true, requiresReview: true },
                { status: 200 }
            );
        }

        const mappedStatus =
            statusMap[resourceStatus as keyof typeof statusMap];

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
                    paymongo_refund_id: true,
                    paymongo_refund_status: true,
                    payment_status: true,
                },
            });
            if (!booking) {
                console.warn(
                    "No booking matches the PayMongo refund event.",
                    { refundId, paymentId }
                );
                return NextResponse.json(
                    { received: true, requiresReview: true },
                    { status: 200 }
                );
            }
            if (booking.paymongo_refund_status === "SUCCEEDED") {
                return NextResponse.json(
                    { received: true, alreadyProcessed: true },
                    { status: 200 }
                );
            }
            if (
                booking.paymongo_refund_id &&
                booking.paymongo_refund_id !== refundId
            ) {
                console.error(
                    "PayMongo refund ID does not match the booking record.",
                    {
                        bookingId: booking.id,
                        existingRefundId: booking.paymongo_refund_id,
                        receivedRefundId: refundId,
                    }
                );
                return NextResponse.json(
                    { received: true, requiresReview: true },
                    { status: 200 }
                );
            }
            await prisma.booking.update({
                where: { id: booking.id },
                data: {
                    paymongo_refund_id: refundId,
                    paymongo_refund_status: mappedStatus,
                    ...(mappedStatus === "SUCCEEDED"
                        ? { payment_status: "REFUNDED" as const }
                        : {}),
                },
            });
            return NextResponse.json(
                {
                    received: true,
                    refundId,
                    refundStatus: mappedStatus,
                },
                { status: 200 }
            );
        } catch (error) {
            console.error(
                "PayMongo refund webhook processing failed:",
                { refundId, error }
            );

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

    if (
        typeof sessionId !== "string" ||
        typeof bookingRef !== "string" ||
        !Array.isArray(payments)
    ) {
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
        if (
            booking.status === "CONFIRMED" &&
            booking.payment_status === "PAID"
        ) {
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
        if (
            typeof paidPayment.id !== "string" ||
            paidPayment.id.trim().length === 0
        ) {
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
        if (
            paidAmount !== expectedAmount ||
            typeof paidCurrency !== "string" ||
            paidCurrency.toUpperCase() !== "PHP"
        ) {
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

        if (
            booking.status !== "PENDING" ||
            booking.payment_status !== "PENDING" ||
            (booking.payment_expires_at !== null &&
                booking.payment_expires_at < new Date())
        ) {
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
        const confirmation = await prisma.booking.updateMany({
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