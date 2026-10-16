"use client";
import { useState } from "react";

type ActiveBooking = {
    id: number;
    booking_ref: string;
    guest_fname: string;
    guest_lname: string;
    guest_email: string;
    guest_phone: string;
    check_in: string;
    check_out: string;
    total: number;
    payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    room: {
        name: string;
    };
};
type Props = {
    bookings: ActiveBooking[];
};
function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(`${date.slice(0, 10)}T00:00:00.000Z`));
}
function getNights(checkIn: string, checkOut: string) {
    const start = new Date(`${checkIn.slice(0, 10)}T00:00:00.000Z`);
    const end = new Date(`${checkOut.slice(0, 10)}T00:00:00.000Z`);
    return Math.round(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
}

export default function ActiveBookingsModal({ bookings }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full cursor-pointer rounded-xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ borderColor: "var(--color-border)" }}
                aria-haspopup="dialog"
                aria-expanded={isOpen}>
                <p
                    className="text-sm font-medium"
                    style={{ color: "var(--color-muted)" }}>
                    Active Bookings
                </p>
                <p
                    className="mt-2 text-3xl font-bold"
                    style={{ color: "var(--color-forest-900)" }}>
                    {bookings.length}
                </p>
                <p
                    className="mt-2 text-xs"
                    style={{ color: "var(--color-muted)" }}>
                    Confirmed stays that have not checked out
                </p>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsOpen(false);
                        }
                    }}>
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="active-bookings-title"
                        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id="active-bookings-title"
                                    className="text-xl font-semibold"
                                    style={{
                                        color: "var(--color-forest-900)",
                                    }}>
                                    Active Bookings
                                </h2>
                                <p
                                    className="mt-1 text-sm"
                                    style={{ color: "var(--color-muted)" }}>
                                    Manage and review your guests' confirmed stays.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="shrink-0 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                                style={{
                                    borderColor: "var(--color-border)",
                                }}
                                aria-label="Close active bookings">
                                Close ✕
                            </button>
                        </div>

                        {bookings.length === 0 ? (
                            <div
                                className="rounded-xl border border-dashed px-6 py-12 text-center"
                                style={{
                                    borderColor: "var(--color-border)",
                                }}>
                                <p className="text-lg font-semibold">
                                    No active bookings
                                </p>
                                <p
                                    className="mt-2 text-sm"
                                    style={{ color: "var(--color-muted)" }}>
                                    Confirmed stays will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map((booking) => {
                                    const paymentPaid =
                                        booking.payment_status === "PAID";
                                    return (
                                        <article
                                            key={booking.id}
                                            className="rounded-xl border p-4 sm:p-5"
                                            style={{
                                                borderColor:
                                                    "var(--color-border)",
                                            }}>
                                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                                <div>
                                                    <p
                                                        className="text-xs font-medium uppercase tracking-wide"
                                                        style={{
                                                            color: "var(--color-muted)",
                                                        }}>
                                                        Booking reference
                                                    </p>
                                                    <h3
                                                        className="mt-1 text-lg font-bold"
                                                        style={{
                                                            color: "var(--color-forest-900)",
                                                        }}>
                                                        {booking.booking_ref}
                                                    </h3>
                                                    <p className="mt-1 font-medium">
                                                        {booking.guest_fname}{" "}
                                                        {booking.guest_lname}
                                                    </p>
                                                    <p
                                                        className="mt-1 break-all text-sm"
                                                        style={{
                                                            color: "var(--color-muted)",
                                                        }}>
                                                        {booking.guest_email}
                                                    </p>
                                                    <p
                                                        className="mt-1 text-sm"
                                                        style={{
                                                            color: "var(--color-muted)",
                                                        }}>
                                                        {booking.guest_phone}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`w-fit p-1 rounded - full px-3 py-1 text-xs font-semibold ${paymentPaid
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-amber-100 text-amber-800"
                                                        } `}>
                                                    Payment: {booking.payment_status}
                                                </span>
                                            </div>
                                            <div
                                                className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-2"
                                                style={{
                                                    borderColor:
                                                        "var(--color-border)",
                                                }}>
                                                <div>
                                                    <p
                                                        className="text-xs"
                                                        style={{
                                                            color: "var(--color-muted)",
                                                        }}>
                                                        Room
                                                    </p>
                                                    <p className="mt-1 font-semibold">
                                                        {booking.room.name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        className="text-xs"
                                                        style={{
                                                            color: "var(--color-muted)",
                                                        }}>
                                                        Length of stay
                                                    </p>
                                                    <p className="mt-1 font-semibold">
                                                        {getNights(
                                                            booking.check_in,
                                                            booking.check_out,
                                                        )}{" "}
                                                        nights
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        className="text-xs"
                                                        style={{
                                                            color: "var(--color-muted)",
                                                        }}>
                                                        Check-in
                                                    </p>
                                                    <p className="mt-1 font-medium">
                                                        {formatDate(
                                                            booking.check_in,
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        className="text-xs"
                                                        style={{
                                                            color: "var(--color-muted)",
                                                        }}>
                                                        Check-out
                                                    </p>
                                                    <p className="mt-1 font-medium">
                                                        {formatDate(
                                                            booking.check_out,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                className="mt-4 flex items-center justify-between border-t pt-4"
                                                style={{
                                                    borderColor:
                                                        "var(--color-border)",
                                                }}>
                                                <span
                                                    className="text-sm"
                                                    style={{
                                                        color: "var(--color-muted)",
                                                    }}>
                                                    Total booking amount
                                                </span>
                                                <span
                                                    className="text-lg font-bold"
                                                    style={{
                                                        color: "var(--color-forest-900)",
                                                    }}>
                                                    ₱{booking.total.toLocaleString("en-PH",)}
                                                </span>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}