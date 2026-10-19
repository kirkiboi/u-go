
"use client";
import Link from "next/link";
import { useState } from "react";

export default function CheckInForm({
    bookingId,
    bookingRef,
}: {
    bookingId: number;
    bookingRef: string;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    async function handleCheckIn() {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(
                `/api/bookings/${bookingId}/check-in`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            const data = await response.json();
            if (!response.ok) {
                setError(data.error ?? "Unable to check in this guest.");
                return;
            }
            setSuccess(true);
        } catch {
            setError("A network error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <section className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <h2 className="font-semibold text-emerald-900">
                    Guest checked in
                </h2>
                <p className="text-sm text-emerald-800">
                    Booking {bookingRef} has been marked as CHECKED IN.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Link
                        href={`/admin/bookings/${bookingId}`}
                        className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-white">
                        View booking
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5">
            <h2 className="font-semibold text-stone-900">
                Confirm Check-In
            </h2>
            <p className="text-sm leading-6 text-stone-600">
                This will change the booking status from CONFIRMED to
                CHECKED-IN. Continue only if the guest has arrived.
            </p>
            {error && (
                <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    {error}
                </p>
            )}
            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={handleCheckIn}
                    disabled={loading}
                    className="rounded-lg bg-[var(--color-forest-800)] px-5 py-2.5 text-sm font-medium text-white cursor-pointer hover:bg-[var(--color-forest-900)] disabled:cursor-not-allowed disabled:opacity-50">
                    {loading ? "Checking in..." : "Confirm Check-in"}
                </button>
                <Link
                    href={`/admin/bookings`}
                    className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50">
                    Cancel
                </Link>
            </div>
        </section>
    );
}