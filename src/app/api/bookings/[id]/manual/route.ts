import { BookingStatus, Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";

export const runtime = "nodejs";

type ManualOverrideBody = {
    status?: unknown;
    checkIn?: unknown;
    checkOut?: unknown;
    reason?: unknown;
};

function isValidDate(value: unknown): value is string {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    );
}

function dateString(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function todayInPhilippines(): string {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}

function errorResponse(message: string, status: number) {
    return NextResponse.json({ error: message }, { status });
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await requireAdmin();

        const { id: idParam } = await params;
        const bookingId = Number(idParam);

        if (!Number.isSafeInteger(bookingId) || bookingId < 1) {
            return errorResponse("Invalid booking ID.", 400);
        }

        let body: ManualOverrideBody;

        try {
            body = await request.json();
        } catch {
            return errorResponse("Invalid request body.", 400);
        }
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return errorResponse("Invalid request body.", 400);
        }

        if (typeof body.status !== "string" || !Object.values(BookingStatus).includes(body.status as BookingStatus,)) {
            return errorResponse("Please select a valid booking status.", 400);
        }
        const nextStatus = body.status as BookingStatus;
        const reason = typeof body.reason === "string" ? body.reason.trim() : "";

        if (reason.length < 10 || reason.length > 1000) {
            return errorResponse(
                "Provide a reason between 10 and 1000 characters.",
                400,
            );
        }

        const hasCheckIn = body.checkIn !== undefined;
        const hasCheckOut = body.checkOut !== undefined;

        if (hasCheckIn !== hasCheckOut) {
            return errorResponse(
                "Provide both check-in and check-out dates.",
                400,
            );
        }

        const datesProvided = hasCheckIn && hasCheckOut;

        if (datesProvided && (!isValidDate(body.checkIn) || !isValidDate(body.checkOut))) {
            return errorResponse("Please provide valid dates.", 400);
        }

        const requestedCheckIn = datesProvided ? (body.checkIn as string) : null;
        const requestedCheckOut = datesProvided ? (body.checkOut as string) : null;

        const today = todayInPhilippines();
        const now = new Date();

        const updatedBooking = await prisma.$transaction(
            async (tx) => {
                const booking = await tx.booking.findUnique({
                    where: { id: bookingId },
                });

                if (!booking) {
                    throw new Error("BOOKING_NOT_FOUND");
                }

                const previousCheckIn = dateString(booking.check_in);
                const previousCheckOut = dateString(booking.check_out);
                const nextCheckIn = requestedCheckIn ?? previousCheckIn;
                const nextCheckOut = requestedCheckOut ?? previousCheckOut;

                if (nextCheckOut <= nextCheckIn) {
                    throw new Error("INVALID_DATE_RANGE");
                }

                const datesChanged = nextCheckIn !== previousCheckIn || nextCheckOut !== previousCheckOut;

                if (booking.status === "COMPLETED" && nextStatus !== "COMPLETED") {
                    throw new Error("COMPLETED_BOOKING_LOCKED");
                }
                if (nextStatus === "PENDING" && booking.status !== "PENDING") {
                    throw new Error("INVALID_STATUS_TRANSITION");
                }

                if (nextStatus === "CONFIRMED" && booking.payment_status !== "PAID") {
                    throw new Error("PAYMENT_NOT_VERIFIED");
                }
                if (nextStatus === "CONFIRMED" && (booking.status !== "CONFIRMED" || datesChanged) && nextCheckIn <= today) {
                    throw new Error("CHECK_IN_NOT_IN_FUTURE");
                }
                if (nextStatus === "COMPLETED" && booking.payment_status !== "PAID") {
                    throw new Error("PAYMENT_NOT_VERIFIED");
                }
                if (nextStatus === "COMPLETED" && nextCheckOut > today) {
                    throw new Error("STAY_NOT_FINISHED");
                }
                if (nextStatus === booking.status && !datesChanged) {
                    throw new Error("NO_CHANGES");
                }
                const shouldReserveDates =
                    nextStatus === "CONFIRMED" ||
                    nextStatus === "CHECKED_IN" ||
                    (nextStatus === "PENDING" &&
                        booking.payment_status === "PENDING" &&
                        booking.payment_expires_at !== null &&
                        booking.payment_expires_at > now);
                if (shouldReserveDates) {
                    const overlappingBooking = await tx.booking.findFirst({
                        where: {
                            id: { not: booking.id },
                            room_id: booking.room_id,
                            check_in: {
                                lt: new Date(
                                    `${nextCheckOut}T00:00:00.000Z`,
                                ),
                            },
                            check_out: {
                                gt: new Date(
                                    `${nextCheckIn}T00:00:00.000Z`,
                                ),
                            },
                            OR: [
                                { status: "CONFIRMED" },
                                { status: "CHECKED_IN" },
                                {
                                    status: "PENDING",
                                    payment_status: "PENDING",
                                    payment_expires_at: { gt: now },
                                },
                            ],
                        },
                        select: { id: true },
                    });

                    if (overlappingBooking) {
                        throw new Error("DATES_UNAVAILABLE");
                    }
                }
                const previousData = {
                    booking_ref: booking.booking_ref,
                    room_id: booking.room_id,
                    status: booking.status,
                    payment_status: booking.payment_status,
                    check_in: previousCheckIn,
                    check_out: previousCheckOut,
                };
                const newData = {
                    booking_ref: booking.booking_ref,
                    room_id: booking.room_id,
                    status: nextStatus,
                    payment_status: booking.payment_status,
                    check_in: nextCheckIn,
                    check_out: nextCheckOut,
                };
                const updated = await tx.booking.update({
                    where: { id: booking.id },
                    data: {
                        status: nextStatus,
                        ...(datesChanged
                            ? {
                                check_in: new Date(`${nextCheckIn}T00:00:00.000Z`,),
                                check_out: new Date(`${nextCheckOut}T00:00:00.000Z`,),
                            }
                            : {}),
                    },
                });
                await tx.bookingAuditLog.create({
                    data: {
                        booking_id: booking.id,
                        admin_user_id: session.userId,
                        actor_type: "ADMIN",
                        action: "MANUAL_BOOKING_OVERRIDE",
                        reason,
                        previous_data: previousData,
                        new_data: newData,
                    },
                });

                return updated;
            },
            {
                isolationLevel:
                    Prisma.TransactionIsolationLevel.Serializable,
            },
        );
        return NextResponse.json({
            message: "Booking updated successfully.",
            booking: {
                id: updatedBooking.id,
                bookingRef: updatedBooking.booking_ref,
                status: updatedBooking.status,
                paymentStatus: updatedBooking.payment_status,
                checkIn: dateString(updatedBooking.check_in),
                checkOut: dateString(updatedBooking.check_out),
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            switch (error.message) {
                case "Unauthorized.":
                    return errorResponse("Please sign in.", 401);
                case "Forbidden.":
                    return errorResponse("Administrator access is required.", 403,);
                case "BOOKING_NOT_FOUND":
                    return errorResponse("Booking not found.", 404);
                case "INVALID_DATE_RANGE":
                    return errorResponse("Check-out must be after check-in.", 400,);
                case "INVALID_STATUS_TRANSITION":
                    return errorResponse("A booking cannot be changed back to PENDING.", 409,);
                case "COMPLETED_BOOKING_LOCKED":
                    return errorResponse("A completed booking cannot be moved to another status.", 409,);
                case "PAYMENT_NOT_VERIFIED":
                    return errorResponse("A verified PAID payment is required for this status.", 409,);
                case "CHECK_IN_NOT_IN_FUTURE":
                    return errorResponse("Restoring or rescheduling a booking requires a future check-in date.", 400,);
                case "STAY_NOT_FINISHED":
                    return errorResponse("A booking cannot be completed before its check-out date.", 400,);
                case "NO_CHANGES":
                    return errorResponse("No changes were provided.", 400);
                case "DATES_UNAVAILABLE":
                    return errorResponse("Those dates overlap another active booking.", 409,);
            }
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
                return errorResponse(
                    "Another booking change was processed concurrently. Please review the booking and try again.",
                    409,
                );
            }
        }
        console.error("Manual booking override failed:", error);
        return errorResponse("Unable to update the booking. Please try again.", 500,);
    }
}