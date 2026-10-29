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
    let body: { checkIn?: unknown; checkOut?: unknown };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid request body." },
            { status: 400 },
        );
    }
    const { checkIn, checkOut } = body;
    const isDateOnly = (value: unknown): value is string =>
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(value) &&
        !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)) &&
        new Date(`${value}T00:00:00.000Z`)
            .toISOString()
            .slice(0, 10) === value;

    if (!isDateOnly(checkIn) || !isDateOnly(checkOut)) {
        return NextResponse.json(
            { error: "Valid check-in and check-out dates are required." },
            { status: 400 },
        );
    }

    const newCheckIn = new Date(`${checkIn}T00:00:00.000Z`);
    const newCheckOut = new Date(`${checkOut}T00:00:00.000Z`);
    const todayInManila = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
    const tomorrowInManila = new Date(`${todayInManila}T00:00:00.000Z`,);
    tomorrowInManila.setUTCDate(tomorrowInManila.getUTCDate() + 1);
    if (newCheckIn < tomorrowInManila) {
        return NextResponse.json(
            { error: "Check-in must be at least tomorrow." },
            { status: 400 },
        );
    }
    if (newCheckOut <= newCheckIn) {
        return NextResponse.json(
            { error: "Check-out must be after check-in." },
            { status: 400 },
        );
    }

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            select: {
                id: true,
                booking_ref: true,
                room_id: true,
                status: true,
                payment_status: true,
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
        if (booking.status !== "CONFIRMED") {
            return NextResponse.json(
                { error: "Only confirmed bookings can be rescheduled." },
                { status: 409 },
            );
        }
        const result = await prisma.$transaction(
            async (tx) => {
                const overlappingBooking = await tx.booking.findFirst({
                    where: {
                        id: { not: bookingId },
                        room_id: booking.room_id,
                        check_in: { lt: newCheckOut },
                        check_out: { gt: newCheckIn },
                        OR: [
                            { status: "CONFIRMED" },
                            {
                                status: "PENDING",
                                payment_status: "PENDING",
                                payment_expires_at: { gt: new Date() },
                            },
                            { status: "CHECKED_IN" },
                        ],
                    },
                    select: { id: true },
                });
                if (overlappingBooking) {
                    return { conflict: true as const };
                }
                const updated = await tx.booking.updateMany({
                    where: {
                        id: bookingId,
                        status: "CONFIRMED",
                        check_in: booking.check_in,
                        check_out: booking.check_out,
                    },
                    data: {
                        check_in: newCheckIn,
                        check_out: newCheckOut,
                    },
                });
                if (updated.count !== 1) {
                    return { changed: true as const };
                }

                await tx.bookingAuditLog.create({
                    data: {
                        booking_id: booking.id,
                        admin_user_id: admin.userId,
                        actor_type: "ADMIN",
                        action: "BOOKING_RESCHEDULED",
                        reason: "Administrator rescheduled the booking.",
                        previous_data: {
                            booking_ref: booking.booking_ref,
                            status: booking.status,
                            payment_status: booking.payment_status,
                            room_id: booking.room_id,
                            check_in: booking.check_in
                                .toISOString()
                                .slice(0, 10),
                            check_out: booking.check_out
                                .toISOString()
                                .slice(0, 10),
                        },
                        new_data: {
                            booking_ref: booking.booking_ref,
                            status: booking.status,
                            payment_status: booking.payment_status,
                            room_id: booking.room_id,
                            check_in: checkIn,
                            check_out: checkOut,
                        },
                    },
                });

                return { success: true as const };
            },
            { isolationLevel: "Serializable" },
        );
        if ("conflict" in result) {
            return NextResponse.json(
                { error: "The room is not available for the selected dates.", },
                { status: 409 },
            );
        }
        if ("changed" in result) {
            return NextResponse.json(
                { error: "The booking changed while rescheduling. Refresh and try again.", },
                { status: 409 },
            );
        }
        return NextResponse.json({
            message: "Booking rescheduled successfully.",
            checkIn,
            checkOut,
        });
    } catch (error) {
        console.error("Booking rescheduling failed:", error);
        if (typeof error === "object" && error !== null && "code" in error && error.code === "P2034") {
            return NextResponse.json(
                { error: "The room availability changed while rescheduling. Please refresh and try again.", },
                { status: 409 },
            );
        }
        return NextResponse.json(
            { error: "An unexpected error occurred while rescheduling the booking.", },
            { status: 500 },
        );
    }
}