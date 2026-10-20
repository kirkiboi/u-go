import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";
import CancelBookingForm from "./CancelBookingForm";

export default async function CancelBookingPage({
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
            booking_ref: true,
            status: true,
            payment_status: true,
            check_in: true,
            check_out: true,
            guest_fname: true,
            guest_lname: true,
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

    return (
        <main className="mx-auto max-w-2xl space-y-6 p-6">

            <header>
                <h1 className="mt-4 text-2xl font-bold text-stone-900">
                    Cancel Reservation
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    Review the booking details before cancelling this reservation.
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
                        <dd className="mt-1 font-medium text-stone-900">
                            {booking.status.replaceAll("_", " ")}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-stone-500">Payment Status</dt>
                        <dd className="mt-1 font-medium text-stone-900">
                            {booking.payment_status.replaceAll("_", " ")}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-stone-500">Check-in Date</dt>
                        <dd className="mt-1 font-medium text-stone-900">
                            {formatDate(booking.check_in)}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-stone-500">Check-out Date</dt>
                        <dd className="mt-1 font-medium text-stone-900">
                            {formatDate(booking.check_out)}
                        </dd>
                    </div>
                </dl>
            </section>
            {eligible ? (
                <CancelBookingForm bookingId={booking.id} />
            ) : (
                <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <h2 className="font-semibold text-amber-900">
                        Cancellation unavailable
                    </h2>
                    <p className="mt-2 text-sm text-amber-800">
                        Only confirmed bookings can be cancelled through this
                        action. Refresh the booking details to see the latest
                        status.
                    </p>
                </section>
            )}
        </main>
    );
}