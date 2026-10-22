
"use client";
import { useState } from "react";
import type { BookingStatus } from "@prisma/client";

type Props = {
    bookingId: number;
    bookingRef: string;
    currentStatus: BookingStatus;
    paymentStatus: string;
};

export default function ManualOverrideForm({
    bookingId,
    bookingRef,
    currentStatus,
    paymentStatus,
}: Props) {
    const [status, setStatus] = useState<BookingStatus>(currentStatus);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const isLocked =
        currentStatus === "COMPLETED" ||
        currentStatus === "CHECKED_IN";
    const canConfirm = paymentStatus === "PAID";

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setMessage("");
        setSuccess(false);

        if (reason.trim().length < 10) {
            setMessage("Please provide a reason of at least 10 characters.");
            return;
        }
        setLoading(true);

        try {
            const response = await fetch(
                `/api/bookings/${bookingId}/manual`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status,
                        reason: reason.trim(),
                    }),
                }
            );
            const result = await response.json();

            if (!response.ok) {
                setMessage(result.error || "Unable to update this booking.");
                return;
            }
            setSuccess(true);
            setMessage(result.message || "Booking updated successfully.");
            setReason("");
            window.location.reload();
        } catch {
            setMessage("A network error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm text-stone-500">Booking reference</p>
                <p className="font-semibold text-stone-900">{bookingRef}</p>
                <p className="mt-3 text-sm text-stone-500">Current status</p>
                <p className="font-semibold text-stone-900">{currentStatus}</p>
                <p className="mt-3 text-sm text-stone-500">Payment status</p>
                <p className="font-semibold text-stone-900">{paymentStatus}</p>
            </div>

            {isLocked ? (
                <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                    {currentStatus === "COMPLETED"
                        ? "Completed bookings are locked from manual changes."
                        : "Checked-in bookings are locked from manual changes."}
                </p>
            ) : (
                <>
                    <div>
                        <label
                            htmlFor="status"
                            className="mb-2 block text-sm font-medium text-stone-700">
                            New booking status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value as BookingStatus)
                            }
                            className="w-full rounded-lg border border-stone-300 bg-white p-3"
                            required>
                            <option
                                value="PENDING"
                                disabled={currentStatus !== "PENDING"}>
                                Pending
                            </option>
                            <option value="CONFIRMED" disabled={!canConfirm}>
                                Confirmed
                            </option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="COMPLETED" disabled={!canConfirm}>
                                Completed
                            </option>
                        </select>
                        {!canConfirm && (
                            <p className="mt-2 text-sm text-stone-500">
                                Confirmation and completion require a verified
                                paid payment.
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="reason"
                            className="mb-2 block text-sm font-medium text-stone-700">
                            Reason for manual change
                        </label>

                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            minLength={10}
                            maxLength={1000}
                            rows={4}
                            placeholder="Explain why this booking needs to be changed..."
                            className="w-full rounded-lg border border-stone-300 p-3"
                            required
                        />
                        <p className="mt-1 text-xs text-stone-500">
                            Required for the audit trail. Minimum 10 characters.
                        </p>
                    </div>

                    {message && (
                        <p
                            role="status"
                            className={`rounded-lg p-3 text-sm ${success
                                ? "bg-green-50 text-green-800"
                                : "bg-red-50 text-red-800"
                                }`}>
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-[var(--color-forest-800)] px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                        {loading ? "Saving changes..." : "Save manual override"}
                    </button>
                </>
            )}
        </form>
    );
}