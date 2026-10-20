"use client";
import Link from "next/link";
import { useState } from "react";
import ConfirmationModal from "@/components/reusable/ConfirmationModal";

interface RescheduleBookingFormProps {
    bookingId: number;
    currentCheckIn: string;
    currentCheckOut: string;
    minimumCheckIn: string;
}

export default function RescheduleBookingForm({
    bookingId,
    currentCheckIn,
    currentCheckOut,
    minimumCheckIn,
}: RescheduleBookingFormProps) {
    const [checkIn, setCheckIn] = useState(currentCheckIn);
    const [checkOut, setCheckOut] = useState(currentCheckOut);
    const [isConfirming, setIsConfirming] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const minimumCheckOut = checkIn || minimumCheckIn;
    const datesAreValid =
        checkIn >= minimumCheckIn && checkOut > checkIn;

    async function handleReschedule() {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(
                `/api/bookings/${bookingId}/reschedule`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ checkIn, checkOut }),
                },
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to reschedule the booking.",
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
                    Booking rescheduled successfully
                </h2>
                <p className="mt-2 text-sm text-green-800">
                    The new dates have been saved. The booking status,
                    price, and payment status remain unchanged.
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
        <div className="mt-6">
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="reschedule-check-in"
                        className="mb-2 block text-sm font-medium text-stone-700">
                        New check-in
                    </label>
                    <input
                        id="reschedule-check-in"
                        type="date"
                        required
                        min={minimumCheckIn}
                        value={checkIn}
                        onChange={(event) => {
                            setCheckIn(event.target.value);
                            setError("");
                        }}
                        className="w-full rounded-lg border border-stone-300 p-3 text-sm"
                    />
                </div>

                <div>
                    <label
                        htmlFor="reschedule-check-out"
                        className="mb-2 block text-sm font-medium text-stone-700">
                        New check-out
                    </label>
                    <input
                        id="reschedule-check-out"
                        type="date"
                        required
                        min={minimumCheckOut}
                        value={checkOut}
                        onChange={(event) => {
                            setCheckOut(event.target.value);
                            setError("");
                        }}
                        className="w-full rounded-lg border border-stone-300 p-3 text-sm"
                    />
                </div>
            </div>
            <p className="mt-3 text-xs text-stone-500">
                Check-in must be at least tomorrow. Check-out must be
                after check-in. Availability is verified when you confirm.
            </p>

            {error && (
                <p
                    role="alert"
                    className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={() => {
                        setError("");
                        setIsConfirming(true);
                    }}
                    disabled={!datesAreValid || loading}
                    className="rounded-lg bg-[var(--color-forest-800)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-forest-900)] disabled:cursor-not-allowed disabled:opacity-50">
                    Reschedule Booking
                </button>
                <Link
                    href="/admin/bookings"
                    className="rounded-lg border border-stone-300 px-5 py-3 text-center text-sm font-medium text-stone-700 transition hover:bg-stone-50">
                    Cancel
                </Link>
            </div>
            <ConfirmationModal
                isOpen={isConfirming}
                title="Confirm Rescheduling"
                description={`Are you sure you want to change this booking to check in on ${checkIn} and check out on ${checkOut}? The server will verify room availability before saving the new dates.`}
                confirmLabel="Confirm Reschedule"
                isLoading={loading}
                onCancel={() => setIsConfirming(false)}
                onConfirm={handleReschedule}
            />
        </div>
    );
}