import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    let admin: Awaited<ReturnType<typeof requireAdmin>>;
    try {
        admin = await requireAdmin();
    } catch (error) {
        const message = error instanceof Error ? error.message : "";
        const status = message === "Forbidden." ? 403 : 401;
        return NextResponse.json(
            { error: status === 403 ? "Forbidden." : "Unauthorized." },
            { status },
        );
    }

    const { id } = await params;
    const bookingId = Number(id);

    if (!Number.isSafeInteger(bookingId) || bookingId < 1) {
        return NextResponse.json(
            { error: "Invalid booking ID." },
            { status: 400 },
        );
    }

    const body = await request.json().catch(() => null);
    const reason = typeof body?.reason === "string" ? body.reason.trim() : "";

    if (!reason) {
        return NextResponse.json(
            { error: "A cancellation reason is required." },
            { status: 400 },
        );
    }

    if (reason.length > 500) {
        return NextResponse.json(
            { error: "Cancellation reason cannot exceed 500 characters." },
            { status: 400 },
        );
    }

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            select: {
                id: true,
                booking_ref: true,
                status: true,
                payment_status: true,
                check_in: true,
                check_out: true,
                room_id: true,
            },
        });
        if (!booking) {
            return NextResponse.json(
                { error: "Booking not found." },
                { status: 404 },
            );
        }

        if (booking.status !== "CONFIRMED") {
            return NextResponse.json(
                { error: "Only confirmed bookings can be cancelled through this action.", },
                { status: 409 },
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            const update = await tx.booking.updateMany({
                where: {
                    id: bookingId,
                    status: "CONFIRMED",
                },
                data: {
                    status: "CANCELLED",
                },
            });

            if (update.count !== 1) {
                return false;
            }

            await tx.bookingAuditLog.create({
                data: {
                    booking_id: booking.id,
                    admin_user_id: admin.userId,
                    actor_type: "ADMIN",
                    action: "BOOKING_CANCELLED",
                    reason,
                    previous_data: {
                        booking_ref: booking.booking_ref,
                        status: booking.status,
                        payment_status: booking.payment_status,
                        room_id: booking.room_id,
                        check_in: booking.check_in.toISOString(),
                        check_out: booking.check_out.toISOString(),
                    },
                    new_data: {
                        booking_ref: booking.booking_ref,
                        status: "CANCELLED",
                        payment_status: booking.payment_status,
                        room_id: booking.room_id,
                        check_in: booking.check_in.toISOString(),
                        check_out: booking.check_out.toISOString(),
                    },
                },
            });
            return true;
        });

        if (!result) {
            return NextResponse.json(
                { error: "The booking changed before cancellation could be completed. Refresh and try again.", },
                { status: 409 },
            );
        }
        return NextResponse.json({
            message: "Booking cancelled successfully.",
            status: "CANCELLED",
        });
    } catch (error) {
        console.error("Booking cancellation failed:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred while cancelling the booking.", },
            { status: 500 },
        );
    }
}