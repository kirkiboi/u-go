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
                {
                    error: "Only checked-in bookings can be marked as completed.",
                },
                { status: 409 },
            );
        }
        const result = await prisma.booking.updateMany({
            where: {
                id: bookingId,
                status: "CHECKED_IN",
            },
            data: {
                status: "COMPLETED",
            },
        });
        if (result.count === 0) {
            return NextResponse.json(
                {
                    error: "The booking changed before completion could be recorded. Refresh and try again.",
                },
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
            { error: "An unexpected error occurred while completing the stay." },
            { status: 500 },
        );
    }
}