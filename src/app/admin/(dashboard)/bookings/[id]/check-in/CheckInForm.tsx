
"use client";
import Link from "next/link";
import { useState } from "react";
import ConfirmationModal from "@/components/reusable/ConfirmationModal";

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
    const [isConfirming, setIsConfirming] = useState(false);
    const [isCancelConfirming, setIsCancelConfirming] = useState(false);
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
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={() => setIsCancelConfirming(true)}
                    disabled={loading}
                    className="rounded-lg border border-stone-300 px-5 py-3 text-center text-sm font-medium text-stone-700 transition hover: cursor-pointer bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60">
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={() => setIsConfirming(true)}
                    disabled={loading}
                    className="rounded-lg px-5 py-3 text-sm font-medium text-white transition hover:brightness-110 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                        backgroundColor: "var(--color-forest-700)",
                    }}>
                    Check In Guest
                </button>
            </div>
            <ConfirmationModal
                isOpen={isCancelConfirming}
                title="Cancel Check-In"
                description="Are you sure you want to leave this page? Your check-in action has not been completed."
                confirmLabel="Leave Page"
                isLoading={false}
                onCancel={() => setIsCancelConfirming(false)}
                onConfirm={() => {
                    setIsCancelConfirming(false);
                    window.location.href = "/admin/bookings";
                }}
            />
        </section>
    );
}