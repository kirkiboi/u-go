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
                "Process a refund for the payment that has already been received.",
            href: `${basePath}/refund`,
            enabled: isPaid,
            requirement: "Requires a paid booking.",
        },
        {
            title: "Reschedule Reservation",
            description:
                "Change the stay dates while keeping the reservation confirmed.",
            href: `/admin/bookings/${booking.id}/manual/reschedule`,
            enabled: isConfirmed,
            requirement: "Requires a confirmed booking and available dates.",
        },
        {
            title: "Cancel Reservation",
            description:
                "Cancel the reservation, freeing up the date. This does not refund the payment",
            href: `/admin/bookings/${booking.id}/manual/cancel`,
            enabled: isConfirmed,
            requirement: "Requires a confirmed booking.",
        },
    ];

    return (
        <main className="mx-auto max-w-4xl space-y-8 p-6">
            <div className="mx-auto max-w-5xl">
                <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
                    style={{ color: "var(--color-forest-700)" }}>
                    <span aria-hidden="true">←</span>
                    Back to booking details
                </Link>

                <header className="mt-6">
                    <p className="text-sm font-medium"
                        style={{ color: "var(--color-forest-500)" }}>
                        Manual Management
                    </p>
                    <h1 className="mt-1 text-3xl font-bold"
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "var(--color-forest-900)",
                        }}>
                        Manual Booking Actions
                    </h1>
                </header>
            </div>
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