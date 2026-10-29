import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";
export async function POST(
    _request: Request,
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

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            select: {
                id: true,
                booking_ref: true,
                status: true,
                payment_status: true,
                room_id: true,
                check_in: true,
                check_out: true,
            },
        });
        if (!booking) {
            return NextResponse.json(
                { error: "Booking not found." },
                { status: 404 },
            );
        }
        if (booking.status !== "CHECKED_IN") {
            return NextResponse.json(
                { error: "Only checked-in bookings can be marked as completed.", },
                { status: 409 },
            );
        }
        const result = await prisma.$transaction(async (tx) => {
            const update = await tx.booking.updateMany({
                where: {
                    id: bookingId,
                    status: "CHECKED_IN",
                },
                data: {
                    status: "COMPLETED",
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
                    action: "BOOKING_COMPLETED",
                    reason: "Administrator marked the stay as completed.",
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
                        status: "COMPLETED",
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
                { error: "The booking changed before completion could be recorded. Refresh and try again.", },
                { status: 409 },
            );
        }
        return NextResponse.json({
            message: "Stay marked as completed successfully.",
            status: "COMPLETED",
        });
    } catch (error) {
        console.error("Complete stay failed:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred while completing the stay.", },
            { status: 500 },
        );
    }
}