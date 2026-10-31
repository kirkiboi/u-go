import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";
import { formatTime } from "@/lib/time";

type BookingDetailPageProps = {
    params: Promise<{ id: string }>;
};

function formatDate(date: Date) {
    return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
}

function formatCurrency(amount: number) {
    return `₱${amount.toLocaleString("en-PH")}`;
}

function getStatusStyles(status: string) {
    switch (status) {
        case "CONFIRMED":
        case "PAID":
            return {
                backgroundColor: "var(--color-forest-100)",
                color: "var(--color-forest-700)",
            };
        case "PENDING":
            return {
                backgroundColor: "#fef3c7",
                color: "#92400e",
            };
        case "COMPLETED":
            return {
                backgroundColor: "#dbeafe",
                color: "#1d4ed8",
            };
        case "CANCELLED":
        case "FAILED":
        case "REFUNDED":
            return {
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
            };
        default:
            return {
                backgroundColor: "#f3f4f6",
                color: "#4b5563",
            };
    }
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
            style={getStatusStyles(status)}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    );
}

function DetailItem({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <p
                className="text-sm"
                style={{ color: "var(--color-muted)" }}>
                {label}
            </p>
            <div
                className="mt-1 font-medium"
                style={{ color: "var(--color-forest-900)" }}>
                {children}
            </div>
        </div>
    );
}

export default async function BookingDetailPage({
    params,
}: BookingDetailPageProps) {
    await requireAdmin();
    const { id } = await params;
    const bookingId = Number(id);
    if (!Number.isInteger(bookingId) || bookingId < 1) {
        notFound();
    }
    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
        include: {
            room: {
                select: {
                    name: true,
                },
            },
        },
    });
    if (!booking) {
        notFound();
    }

    return (
        <main className="min-h-screen px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/admin/bookings"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
                    style={{ color: "var(--color-forest-700)" }}>
                    <span aria-hidden="true">←</span>
                    Back to Bookings
                </Link>

                <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p
                            className="text-sm font-medium"
                            style={{ color: "var(--color-forest-500)" }}>
                            Booking Management
                        </p>
                        <h1
                            className="mt-1 text-3xl font-bold"
                            style={{
                                fontFamily: "var(--font-display)",
                                color: "var(--color-forest-900)",
                            }}>
                            Booking Details
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={`/admin/bookings/${booking.id}/manual`}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-stone-50"
                            style={{
                                borderColor: "var(--color-border)",
                                color: "var(--color-forest-700)",
                            }}>
                            Manual Override
                        </Link>
                    </div>
                </header>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <section
                        className="rounded-xl border bg-white p-6 shadow-sm"
                        style={{ borderColor: "var(--color-border)" }}>
                        <h2
                            className="text-lg font-semibold"
                            style={{ color: "var(--color-forest-900)" }}>
                            Guest Information
                        </h2>
                        <div className="mt-5 grid gap-5">
                            <DetailItem label="Full Name">
                                {booking.guest_fname} {booking.guest_lname}
                            </DetailItem>
                            <DetailItem label="Email Address">
                                <span
                                    className="break-all">
                                    {booking.guest_email}
                                </span>
                            </DetailItem>
                            <DetailItem label="Phone Number">
                                <span>
                                    {booking.guest_phone}
                                </span>
                            </DetailItem>
                        </div>
                    </section>

                    <section
                        className="rounded-xl border bg-white p-6 shadow-sm"
                        style={{ borderColor: "var(--color-border)" }}>
                        <h2
                            className="text-lg font-semibold"
                            style={{ color: "var(--color-forest-900)" }}>
                            Accommodation
                        </h2>
                        <div className="mt-5 grid gap-5">
                            <DetailItem label="Room">
                                {booking.room.name}
                            </DetailItem>
                            <DetailItem label="Check-in">
                                {formatDate(booking.check_in)} at {formatTime(booking.check_in_time)}
                            </DetailItem>
                            <DetailItem label="Check-out">
                                {formatDate(booking.check_out)} at {formatTime(booking.check_out_time)}
                            </DetailItem>
                            <DetailItem label="Price per Night">
                                {formatCurrency(booking.room_price)}
                            </DetailItem>
                            <DetailItem label="Booking Status">
                                <StatusBadge status={booking.status} />
                            </DetailItem>
                        </div>
                    </section>

                    <section
                        className="rounded-xl border bg-white p-6 shadow-sm"
                        style={{ borderColor: "var(--color-border)" }}>
                        <h2
                            className="text-lg font-semibold"
                            style={{ color: "var(--color-forest-900)" }}>
                            Payment Information
                        </h2>
                        <div className="mt-5 grid gap-5">
                            <DetailItem label="Payment Status">
                                <StatusBadge status={booking.payment_status} />
                            </DetailItem>
                            <DetailItem label="Total Booking Amount">
                                <span className="text-xl">
                                    {formatCurrency(booking.total)}
                                </span>
                            </DetailItem>
                        </div>
                    </section>

                    <section
                        className="rounded-xl border bg-white p-6 shadow-sm"
                        style={{ borderColor: "var(--color-border)" }}>
                        <h2
                            className="text-lg font-semibold"
                            style={{ color: "var(--color-forest-900)" }}>
                            Booking Record
                        </h2>

                        <div className="mt-5 grid gap-5">
                            <DetailItem label="Booking Reference">
                                {booking.booking_ref}
                            </DetailItem>
                            <DetailItem label="Created At">
                                {`${booking.createdAt.toLocaleDateString("en-PH", { dateStyle: "medium" })} at ${booking.createdAt.toLocaleTimeString("en-PH", { timeStyle: "short" })}`}
                            </DetailItem>
                            <DetailItem label="Last Updated">
                                {`${booking.updatedAt.toLocaleDateString("en-PH", { dateStyle: "medium" })} at ${booking.updatedAt.toLocaleTimeString("en-PH", { timeStyle: "short" })}`}
                            </DetailItem>
                        </div>
                    </section>
                </div>

                <section
                    className="mt-6 rounded-xl border bg-white p-6 shadow-sm"
                    style={{ borderColor: "var(--color-border)" }}>
                    <h2
                        className="text-lg font-semibold"
                        style={{ color: "var(--color-forest-900)" }}>
                        Special Requests
                    </h2>
                    <p
                        className="mt-3 whitespace-pre-wrap text-sm leading-6"
                        style={{ color: "var(--color-muted)" }}>
                        {booking.special_req?.trim() || "No special requests provided."}
                    </p>
                </section>
            </div>
        </main>
    );
}