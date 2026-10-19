import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";
import CompleteStayForm from "./completeForm";
export default async function CompleteStayPage({
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
            check_in: true,
            check_out: true,
            guest_fname: true,
            guest_lname: true,
        },
    });
    if (!booking) {
        notFound();
    }
    const eligible = booking.status === "CHECKED_IN";
    const formatDate = (date: Date) =>
        date.toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
        });

    return (
        <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
                href={`/admin/bookings/${booking.id}`}
                className="text-sm text-[var(--color-forest-700)] hover:underline">
                ← Back to booking details
            </Link>

            <section className="mt-6 rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
                <h1 className="text-2xl font-semibold text-[var(--color-forest-900)]">
                    Complete Stay
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    Confirm that the guest has finished their stay at the resort.
                </p>
                <div className="mt-6 space-y-3 rounded-lg bg-stone-50 p-4 text-sm">
                    <p>
                        <span className="font-medium text-stone-700">
                            Booking reference:
                        </span>{" "}
                        {booking.booking_ref}
                    </p>
                    <p>
                        <span className="font-medium text-stone-700">
                            Guest:
                        </span>{" "}
                        {booking.guest_fname} {booking.guest_lname}
                    </p>
                    <p>
                        <span className="font-medium text-stone-700">
                            Check-in:
                        </span>{" "}
                        {formatDate(booking.check_in)}
                    </p>
                    <p>
                        <span className="font-medium text-stone-700">
                            Check-out:
                        </span>{" "}
                        {formatDate(booking.check_out)}
                    </p>
                    <p>
                        <span className="font-medium text-stone-700">
                            Current status:
                        </span>{" "}
                        {booking.status.replaceAll("_", " ")}
                    </p>
                </div>
                {eligible ? (
                    <CompleteStayForm bookingId={booking.id} />
                ) : (
                    <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        This booking cannot be completed because its current
                        status is not Checked In. Refresh the booking details
                        to see its latest status.
                    </div>
                )}
            </section>
        </main>
    );
}