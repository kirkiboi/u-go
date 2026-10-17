import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await requireAdmin();
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "";
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
                status: true,
                payment_status: true,
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
                {
                    error: "Only confirmed bookings can be checked in.",
                },
                { status: 409 },
            );
        }
        if (booking.payment_status !== "PAID") {
            return NextResponse.json(
                {
                    error: "Only bookings with verified payment can be checked in.",
                },
                { status: 409 },
            );
        }
        const result = await prisma.booking.updateMany({
            where: {
                id: bookingId,
                status: "CONFIRMED",
                payment_status: "PAID",
            },
            data: {
                status: "CHECKED_IN",
            },
        });
        if (result.count === 0) {
            return NextResponse.json(
                {
                    error: "The booking changed before check-in could be completed. Refresh and try again.",
                },
                { status: 409 },
            );
        }
        return NextResponse.json({
            message: "Guest checked in successfully.",
            status: "CHECKED_IN",
        });
    } catch (error) {
        console.error("Manual check-in failed:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred while checking in the guest." },
            { status: 500 },
        );
    }
}