import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";
import RescheduleBookingForm from "./RescheduleBookingForm";
import { formatTime } from "@/lib/time";
export default async function RescheduleBookingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdmin();
    const { id } = await params;
    const bookingId = Number(id);

    if (!Number.isSafeInteger(bookingId) || bookingId < 1) {
        notFound();
    }

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: {
            id: true,
            room_id: true,
            booking_ref: true,
            status: true,
            check_in: true,
            payment_status: true,
            check_out: true,
            check_in_time: true,
            check_out_time: true,
            guest_fname: true,
            guest_lname: true,
            room: {
                select: {
                    name: true,
                    checkInTime: true,
                    checkOutTime: true,
                },
            },
        },
    });

    if (!booking) {
        notFound();
    }

    const eligible = booking.status === "CONFIRMED";
    const formatDate = (date: Date) =>
        date.toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
        });
    const dateInputValue = (date: Date) =>
        date.toISOString().slice(0, 10);
    const todayInManila = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());

    const tomorrow = new Date(`${todayInManila}T00:00:00.000Z`);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const minimumCheckIn = tomorrow.toISOString().slice(0, 10);

    return (
        <main className="mx-auto max-w-2xl space-y-6 p-6">
            <header>
                <h1 className="mt-4 text-2xl font-bold text-stone-900">
                    Reschedule Reservation
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    Select new dates for this reservation. The room must be
                    available for the entire stay.
                </p>
            </header>

            <section className="rounded-xl border border-stone-200 bg-white p-5">
                <h2 className="text-lg font-semibold text-stone-900">
                    {booking.booking_ref}
                </h2>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm text-stone-500">Guest</dt>
                        <dd className="mt-1 font-medium text-stone-900">
                            {booking.guest_fname} {booking.guest_lname}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-stone-500">Current Status</dt>
                        <dd className="mt-1 font-medium text-stone-900 capitalize">
                            {booking.status.replaceAll("_", " ").toLowerCase()}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-stone-500">Payment Status</dt>
                        <dd className="mt-1 font-medium text-stone-900 capitalize">
                            {booking.payment_status.replaceAll("_", " ").toLowerCase()}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-stone-500">Current Check-in Date</dt>
                        <dd className="mt-1 font-medium text-stone-900">
                            {formatDate(booking.check_in)} at {formatTime(booking.check_in_time)}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-stone-500">Current Check-out Date</dt>
                        <dd className="mt-1 font-medium text-stone-900">
                            {formatDate(booking.check_out)} at {formatTime(booking.check_out_time)}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-stone-500">Accommodation</dt>
                        <dd className="mt-1 font-medium text-stone-900">{booking.room.name}</dd>
                    </div>
                </dl>
            </section>
            {eligible ? (
                <>
                    <RescheduleBookingForm
                        bookingId={booking.id}
                        roomId={booking.room_id}
                        currentCheckIn={dateInputValue(booking.check_in)}
                        currentCheckOut={dateInputValue(booking.check_out)}
                        minimumCheckIn={minimumCheckIn}
                    />
                </>
            ) : (
                <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <h2 className="font-semibold text-amber-900">Rescheduling unavailable</h2>
                    <p className="mt-2 text-sm text-amber-800">
                        Only confirmed bookings can be rescheduled. Refresh the booking details to see the latest status.
                    </p>
                </section>
            )}
        </main >
    );
}