import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";

type ManualAction = {
    title: string;
    description: string;
    href: string;
    enabled: boolean;
    requirement: string;
};

export default async function ManualOverridePage({
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
        },
    });
    if (!booking) {
        notFound();
    }

    const basePath = `/admin/bookings/${booking.id}/manual`;
    const isConfirmed = booking.status === "CONFIRMED";
    const isPaid = booking.payment_status === "PAID";
    const actions: ManualAction[] = [
        {
            title: "Refund Payment",
            description:
                "Process a refund for a payment that has already been received.",
            href: `${basePath}/refund`,
            enabled: isPaid,
            requirement: "Requires a paid booking.",
        },
        {
            title: "Check In Guest",
            description:
                "Mark the guest as arrived and currently staying at the resort.",
            href: `${basePath}/check-in`,
            enabled: isConfirmed && isPaid,
            requirement: "Requires a confirmed, paid booking.",
        },
        {
            title: "Complete Stay",
            description:
                "Mark the stay as finished after the guest has checked out.",
            href: `${basePath}/complete`,
            enabled: booking.status === "CHECKED_IN",
            requirement: "Requires a checked-in guest.",
        },
        {
            title: "Cancel Reservation",
            description:
                "Cancel a confirmed reservation. A refund, if needed, is handled separately.",
            href: `${basePath}/cancel`,
            enabled: isConfirmed,
            requirement: "Requires a confirmed booking.",
        },
        {
            title: "Reschedule Reservation",
            description:
                "Change the stay dates while keeping the reservation confirmed.",
            href: `${basePath}/reschedule`,
            enabled: isConfirmed,
            requirement: "Requires a confirmed booking and available dates.",
        },
    ];

    return (
        <main className="mx-auto max-w-4xl space-y-8 p-6">
            <header>
                <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="text-sm text-stone-600 hover:text-stone-900 hover:underline">
                    ← Back to booking details
                </Link>
                <h1 className="mt-4 text-2xl font-bold text-stone-900">
                    Manual Booking Actions
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    Choose the specific action you need to perform for this
                    reservation.
                </p>
            </header>
            <section>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {actions.map((action) => (
                        <div
                            key={action.title}
                            className={`rounded-xl border p-5 ${action.enabled
                                ? "border-stone-200 bg-white"
                                : "border-stone-200 bg-stone-50 opacity-70"
                                }`}>
                            <h3 className="font-semibold text-stone-900">
                                {action.title}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-stone-600">
                                {action.description}
                            </p>
                            {action.enabled ? (
                                <Link
                                    href={action.href}
                                    className="mt-4 inline-flex font-medium text-emerald-800 hover:underline">
                                    Continue →
                                </Link>
                            ) : (
                                <p className="mt-4 text-sm text-stone-500">
                                    {action.requirement}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}