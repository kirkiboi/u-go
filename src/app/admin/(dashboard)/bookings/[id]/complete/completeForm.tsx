
"use client";
import Link from "next/link";
import { useState } from "react";

export default function CompleteStayForm({
    bookingId,
}: {
    bookingId: number;
}) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    async function handleCompleteStay() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `/api/bookings/${bookingId}/complete`,
                { method: "POST" },
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to complete the stay.",
                );
            }
            setSuccess(true);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred.",
            );
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-5">
                <h2 className="font-semibold text-green-900">
                    Stay completed successfully
                </h2>
                <p className="mt-2 text-sm text-green-800">
                    The booking status has been updated to Completed.
                </p>
                <Link
                    href={`/admin/bookings/${bookingId}`}
                    className="mt-4 inline-block text-sm font-medium text-[var(--color-forest-700)] hover:underline">
                    View booking details →
                </Link>
            </div>
        );
    }

    return (
        <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5">
            <h2 className="font-semibold text-stone-900">
                Confirm Completed Stay
            </h2>
            <p className="text-sm leading-6 text-stone-600">
                This will change the booking status from CHECKED-IN to
                COMPLETED. Continue only if the guest has finished their stay.
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
                    onClick={handleCompleteStay}
                    disabled={loading}
                    className="rounded-lg bg-[var(--color-forest-800)] px-5 py-2.5 text-sm font-medium text-white cursor-pointer hover:bg-[var(--color-forest-900)] disabled:cursor-not-allowed disabled:opacity-50">
                    {loading ? "Completing Stay..." : "Confirm Completed Stay"}
                </button>
                <Link
                    href="/admin/bookings"
                    className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50">
                    Cancel
                </Link>
            </div>
        </section>
    );
}
