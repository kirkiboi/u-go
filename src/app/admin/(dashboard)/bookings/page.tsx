import { prisma } from "@/lib/prisma";
import BookingsList from "./bookingsList";

export default async function BookingsPage() {
    const bookings = await prisma.booking.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            room: {
                select: {
                    name: true,
                },
            },
        },
    });
    return <BookingsList bookings={bookings} />;
}