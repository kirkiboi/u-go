import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";
import CheckInForm from "./CheckInForm";

export default async function CheckInPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    try {
        await requireAdmin();
    } catch {
        redirect("/admin/login");
    }
    const { id } = await params;
    const bookingId = Number(id);
    const formatDate = (date: Date) =>
        date.toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
        });
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
            room: {
                select: {
                    checkInTime: true,
                    checkOutTime: true,
                },
            },
        },
    });
    if (!booking) {
        notFound();
    }
    const eligible =
        booking.status === "CONFIRMED" &&
        booking.payment_status === "PAID";

    return (
        <main className="mx-auto max-w-2xl space-y-6 p-6">
            <header>
                <h1 className="mt-4 text-2xl font-bold text-stone-900">
                    Check In
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    Confirm that the guest has arrived at the resort and is
                    beginning their stay.
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
                        <dd className="mt-1 font-medium capitalize text-stone-900">
                            {booking.status.replaceAll("_", " ").toLowerCase()}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-stone-500">Payment Status</dt>
                        <dd className="mt-1 font-medium capitalize text-stone-900">
                            {booking.payment_status.replaceAll("_", " ").toLowerCase()}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-stone-500">Check-in Date</dt>
                        <dd className="mt-1 font-medium text-stone-900">
                            {formatDate(booking.check_in)} at {booking.room.checkInTime}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-stone-500">Check-out Date</dt>
                        <dd className="mt-1 font-medium text-stone-900">
                            {formatDate(booking.check_out)} at {booking.room.checkOutTime}
                        </dd>
                    </div>
                </dl>
            </section>
            {eligible ? (
                <CheckInForm
                    bookingId={booking.id}
                    bookingRef={booking.booking_ref}
                />
            ) : (
                <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <h2 className="font-semibold text-amber-900">
                        Check-in unavailable
                    </h2>
                    <p className="mt-2 text-sm text-amber-800">
                        Only confirmed bookings with paid payments can be
                        checked in. Refresh the booking details to see its
                        latest status.
                    </p>
                </section>
            )}
        </main>
    );
}