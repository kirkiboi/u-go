"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/reusable/ConfirmationModal";

export default function CancelBookingForm({
    bookingId,
}: {
    bookingId: number;
}) {
    const router = useRouter();
    const [isConfirming, setIsConfirming] = useState(false);
    const [isConfirmingGoBack, setIsConfirmingGoBack] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    async function handleCancelBooking() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `/api/bookings/${bookingId}/cancel`,
                { method: "POST" },
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to cancel the booking.",
                );
            }
            setIsConfirming(false);
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
                    Booking cancelled successfully
                </h2>

                <p className="mt-2 text-sm text-green-800">
                    The booking status is now Cancelled.
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
                Confirm Booking Cancellation
            </h2>
            <p className="text-sm leading-6 text-stone-600">
                Cancelling this booking will release its reservation status.
                This action does not issue a refund.
            </p>
            {error && (
                <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    {error}
                </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={() => setIsConfirmingGoBack(true)}
                    disabled={loading}
                    className="cursor-pointer rounded-lg border border-stone-300 px-5 py-3 text-center text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60">
                    Go Back
                </button>

                <button
                    type="button"
                    onClick={() => setIsConfirming(true)}
                    disabled={loading}
                    className="rounded-lg px-5 py-3 text-sm font-medium text-white transition hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: "var(--color-forest-800)" }}>
                    Confirm Cancellation
                </button>
            </div>

            <ConfirmationModal
                isOpen={isConfirmingGoBack}
                title="Leave Cancellation Page?"
                description="Are you sure you want to leave this page? Your cancellation has not been submitted."
                confirmLabel="Leave Page"
                variant="danger"
                isLoading={false}
                onCancel={() => setIsConfirmingGoBack(false)}
                onConfirm={() => {
                    setIsConfirmingGoBack(false);
                    router.push(`/admin/bookings/${bookingId}`);
                }}
            />

            <ConfirmationModal
                isOpen={isConfirming}
                title="Confirm Booking Cancellation"
                description="Are you sure you want to cancel this booking? This changes the booking status to &quot;Cancelled&quot; but does not issue a refund."
                confirmLabel="Confirm Cancellation"
                variant="danger"
                isLoading={loading}
                onCancel={() => setIsConfirming(false)}
                onConfirm={handleCancelBooking}
            />
        </section >
    );
}