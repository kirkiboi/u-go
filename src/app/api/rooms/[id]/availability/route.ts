import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const roomId = Number(id);
        if (!Number.isSafeInteger(roomId) || roomId < 1) {
            return NextResponse.json(
                { error: "Invalid accommodation." },
                { status: 400 }
            );
        }

        const room = await prisma.room.findUnique({
            where: { id: roomId },
            select: { id: true },
        });

        if (!room) {
            return NextResponse.json(
                { error: "Accommodation not found." },
                { status: 404 }
            );
        }
        const now = new Date();
        const todayInPhilippines = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(now);
        const today = new Date(
            `${todayInPhilippines}T00:00:00.000Z`
        );
        const bookings = await prisma.booking.findMany({
            where: {
                room_id: roomId,
                check_out: { gt: today },
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
            select: {
                check_in: true,
                check_out: true,
            },
            orderBy: {
                check_in: "asc",
            },
        });

        return NextResponse.json({
            unavailableRanges: bookings.map((booking) => ({
                checkIn: booking.check_in.toISOString().slice(0, 10),
                checkOut: booking.check_out.toISOString().slice(0, 10),
            })),
        });
    } catch (error) {
        console.error("Failed to retrieve room availability:", error);
        return NextResponse.json(
            { error: "Unable to retrieve accommodation availability." },
            { status: 500 }
        );
    }
}