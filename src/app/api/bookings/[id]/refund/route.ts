import { randomUUID } from "node:crypto";
import { PayMongoRefundStatus, Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";

export const runtime = "nodejs";

const REFUND_REASONS = [
    "duplicate",
    "fraudulent",
    "requested_by_customer",
    "others",
] as const;

type RefundReason = (typeof REFUND_REASONS)[number];

type RefundRequestBody = {
    reason?: unknown;
    justification?: unknown;
};

type PayMongoRefundResult = {
    data?: {
        id?: unknown;
        attributes?: {
            status?: unknown;
        };
    };
};

function errorResponse(message: string, status: number) {
    return NextResponse.json({ error: message }, { status });
}

function isRefundReason(value: unknown): value is RefundReason {
    return (
        typeof value === "string" &&
        REFUND_REASONS.includes(value as RefundReason)
    );
}

function getRefundStatus(value: unknown): PayMongoRefundStatus | null {
    if (typeof value !== "string") {
        return null;
    }
    const statuses: Record<string, PayMongoRefundStatus> = {
        pending: PayMongoRefundStatus.PENDING,
        processing: PayMongoRefundStatus.PROCESSING,
        succeeded: PayMongoRefundStatus.SUCCEEDED,
        failed: PayMongoRefundStatus.FAILED,
    };
    return statuses[value] ?? null;
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireAdmin();
        const admin = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { role: true },
        });

        if (!admin || admin.role !== "admin") {
            return errorResponse(
                "Administrator access is required.",
                403
            );
        }

        const secretKey = process.env.PAYMONGO_SECRET_KEY;

        if (!secretKey) {
            return errorResponse(
                "Payment configuration is missing.",
                500
            );
        }

        const { id: idParam } = await params;
        const bookingId = Number(idParam);
        if (!Number.isSafeInteger(bookingId) || bookingId < 1) {
            return errorResponse("Invalid booking ID.", 400);
        }

        let body: RefundRequestBody;

        try {
            body = await request.json();
        } catch {
            return errorResponse("Invalid request body.", 400);
        }

        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return errorResponse("Invalid request body.", 400);
        }

        if (!isRefundReason(body.reason)) {
            return errorResponse("Please select a valid refund reason.", 400);
        }

        const justification = typeof body.justification === "string" ? body.justification.trim() : "";
        if (
            justification.length < 10 ||
            justification.length > 1000
        ) {
            return errorResponse("Provide a justification between 10 and 1000 characters.", 400);
        }

        const reason = body.reason;
        const idempotencyKey = randomUUID();
        const refundRequest = await prisma.$transaction(
            async (tx) => {
                const booking = await tx.booking.findUnique({
                    where: { id: bookingId },
                });

                if (!booking) {
                    throw new Error("BOOKING_NOT_FOUND");
                }

                if (booking.payment_status === "REFUNDED") {
                    throw new Error("ALREADY_REFUNDED");
                }

                if (booking.payment_status !== "PAID") {
                    throw new Error("PAYMENT_NOT_PAID");
                }

                if (!booking.paymongo_payment_id) {
                    throw new Error("PAYMENT_ID_MISSING");
                }

                if (booking.paymongo_refund_status === PayMongoRefundStatus.PENDING || booking.paymongo_refund_status === PayMongoRefundStatus.PROCESSING) {
                    throw new Error("REFUND_IN_PROGRESS");
                }

                if (booking.paymongo_refund_status === PayMongoRefundStatus.SUCCEEDED) {
                    throw new Error("ALREADY_REFUNDED");
                }

                if (booking.paymongo_refund_status === PayMongoRefundStatus.FAILED && booking.paymongo_refund_id) {
                    throw new Error("REFUND_REQUIRES_REVIEW");
                }

                const previousData = {
                    status: booking.status,
                    payment_status: booking.payment_status,
                    paymongo_refund_status: booking.paymongo_refund_status,
                    paymongo_refund_id: booking.paymongo_refund_id,
                };

                const claim = await tx.booking.updateMany({
                    where: {
                        id: booking.id,
                        payment_status: "PAID",
                        paymongo_payment_id:
                            booking.paymongo_payment_id,
                        paymongo_refund_id: null,
                        paymongo_refund_status:
                            booking.paymongo_refund_status,
                    },
                    data: {
                        paymongo_refund_status:
                            PayMongoRefundStatus.PENDING,
                        paymongo_refund_idempotency_key:
                            idempotencyKey,
                        paymongo_refund_reason: reason,
                    },
                });

                if (claim.count !== 1) {
                    throw new Error("REFUND_CLAIM_FAILED");
                }

                await tx.bookingAuditLog.create({
                    data: {
                        booking_id: booking.id,
                        admin_user_id: session.userId,
                        action: "MANUAL_PAYMENT_REFUND",
                        reason: justification,
                        previous_data: previousData,
                        new_data: {
                            status: booking.status,
                            payment_status: booking.payment_status,
                            paymongo_refund_status:
                                PayMongoRefundStatus.PENDING,
                            refund_reason: reason,
                            refund_amount: booking.total,
                        },
                    },
                });

                return {
                    id: booking.id,
                    bookingRef: booking.booking_ref,
                    paymentId: booking.paymongo_payment_id,
                    amount: booking.total * 100,
                    idempotencyKey,
                };
            },
            {
                isolationLevel:
                    Prisma.TransactionIsolationLevel.Serializable,
            }
        );

        let response: Response;

        try {
            response = await fetch(
                "https://api.paymongo.com/v1/refunds",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Basic ${Buffer.from(
                            `${secretKey}:`
                        ).toString("base64")}`,
                        "Content-Type": "application/json",
                        "Idempotency-Key":
                            refundRequest.idempotencyKey,
                    },
                    body: JSON.stringify({
                        data: {
                            attributes: {
                                amount: refundRequest.amount,
                                payment_id: refundRequest.paymentId,
                                reason,
                                notes: `U-GO booking ${refundRequest.bookingRef} refund`,
                            },
                        },
                    }),
                    signal: AbortSignal.timeout(30_000),
                }
            );
        } catch (error) {
            console.error("PayMongo refund request outcome is uncertain:",
                {
                    bookingRef: refundRequest.bookingRef,
                    error,
                }
            );
            return NextResponse.json(
                {
                    error: "The refund outcome could not be verified. Do not submit another refund; reconcile its status first.",
                    refundStatus: "PENDING",
                },
                { status: 502 }
            );
        }

        let result: PayMongoRefundResult | null = null;

        try {
            result = (await response.json()) as PayMongoRefundResult;
        } catch {

        }

        if (!response.ok) {
            console.error("PayMongo rejected the refund request:", {
                bookingRef: refundRequest.bookingRef,
                httpStatus: response.status,
            });

            if (response.status >= 500) {
                return NextResponse.json(
                    {
                        error: "PayMongo returned a server error. The refund outcome requires reconciliation.",
                        refundStatus: "PENDING",
                    },
                    { status: 502 }
                );
            }

            await prisma.booking.updateMany({
                where: {
                    id: refundRequest.id,
                    paymongo_refund_id: null,
                    paymongo_refund_idempotency_key:
                        refundRequest.idempotencyKey,
                    paymongo_refund_status:
                        PayMongoRefundStatus.PENDING,
                },
                data: {
                    paymongo_refund_status:
                        PayMongoRefundStatus.FAILED,
                },
            });
            return errorResponse("PayMongo rejected the refund request. Review the payment and try again if appropriate.", 502);
        }

        const refundId = typeof result?.data?.id === "string" ? result.data.id : null;
        const refundStatus = getRefundStatus(result?.data?.attributes?.status);

        if (!refundId || !refundStatus) {
            console.error("Incomplete PayMongo refund response:", {
                bookingRef: refundRequest.bookingRef,
                hasRefundId: Boolean(refundId),
                refundStatus,
            });

            if (refundId) {
                await prisma.booking.updateMany({
                    where: {
                        id: refundRequest.id,
                        paymongo_refund_id: null,
                        paymongo_refund_idempotency_key:
                            refundRequest.idempotencyKey,
                    },
                    data: {
                        paymongo_refund_id: refundId,
                    },
                });
            }

            return NextResponse.json(
                {
                    error:
                        "PayMongo returned an incomplete refund response. Reconcile the refund before taking further action.",
                    refundStatus: "PENDING",
                },
                { status: 502 }
            );
        }

        const updated = await prisma.booking.updateMany({
            where: {
                id: refundRequest.id,
                paymongo_refund_id: null,
                paymongo_refund_idempotency_key:
                    refundRequest.idempotencyKey,
            },
            data: {
                paymongo_refund_id: refundId,
                paymongo_refund_status: refundStatus,
                ...(refundStatus === PayMongoRefundStatus.SUCCEEDED
                    ? { payment_status: "REFUNDED" as const }
                    : {}),
            },
        });

        if (updated.count !== 1) {
            console.error(
                "Refund response received but booking reconciliation failed:",
                {
                    bookingRef: refundRequest.bookingRef,
                    refundId,
                    refundStatus,
                }
            );
            return errorResponse("The refund was created, but its database record needs reconciliation.", 500);
        }

        const messages: Record<PayMongoRefundStatus, string> = {
            PENDING: "Refund submitted and awaiting processing.",
            PROCESSING: "Refund is being processed.",
            SUCCEEDED: "Refund completed successfully.",
            FAILED: "PayMongo reports that the refund failed. Review before retrying.",
        };

        return NextResponse.json({
            message: messages[refundStatus],
            bookingRef: refundRequest.bookingRef,
            refundId,
            refundStatus,
        });
    } catch (error) {
        if (error instanceof Error) {
            switch (error.message) {
                case "Unauthorized.":
                    return errorResponse("Please sign in.", 401);
                case "Forbidden.":
                    return errorResponse("Administrator access is required.", 403);
                case "BOOKING_NOT_FOUND":
                    return errorResponse("Booking not found.", 404);
                case "ALREADY_REFUNDED":
                    return errorResponse("This booking has already been refunded.", 409);
                case "PAYMENT_NOT_PAID":
                    return errorResponse("Only paid bookings can be refunded.", 409);
                case "PAYMENT_ID_MISSING":
                    return errorResponse("The PayMongo payment ID is missing. Reconcile the payment first.", 409);
                case "REFUND_IN_PROGRESS":
                    return errorResponse("A refund is already pending or processing for this booking.", 409);
                case "REFUND_REQUIRES_REVIEW":
                    return errorResponse("The previous refund failed but has a PayMongo refund ID. Reconcile it before retrying.", 409);
                case "REFUND_CLAIM_FAILED":
                    return errorResponse("The booking changed during the refund request. Refresh and review its status.", 409);
            }

            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
                return errorResponse("Another operation was processed concurrently. Refresh and review the booking.", 409);
            }
        }

        console.error("Booking refund failed:", error);

        return errorResponse(
            "Unable to process the refund. Review its status before trying again.",
            500
        );
    }
}