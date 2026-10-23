
"use client";

import { useState } from "react";
import type { PayMongoRefundStatus } from "@prisma/client";

type Props = {
    bookingId: number;
    bookingRef: string;
    guestName: string;
    amount: number;
    bookingStatus: string;
    paymentStatus: string;
    paymentId: string | null;
    refundId: string | null;
    initialRefundStatus: PayMongoRefundStatus | null;
    existingRefundReason: string | null;
};

const refundReasons = [
    {
        value: "cancel",
        label: "Cancellation of Stay",
    },
    {
        value: "duplicate",
        label: "Duplicate payment",
    },
    {
        value: "fraudulent",
        label: "Fraudulent payment",
    },
    {
        value: "others",
        label: "Other reason",
    },
] as const;

const statusLabels: Record<string, string> = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    SUCCEEDED: "Successful",
    FAILED: "Failed",
};

export default function RefundForm({
    bookingId,
    bookingRef,
    guestName,
    amount,
    bookingStatus,
    paymentStatus,
    paymentId,
    refundId,
    initialRefundStatus,
    existingRefundReason,
}: Props) {
    const [reason, setReason] = useState(existingRefundReason ?? "requested_by_customer");
    const [justification, setJustification] = useState("");
    const [refundStatus, setRefundStatus] = useState<PayMongoRefundStatus | null>(initialRefundStatus);
    const [currentRefundId, setCurrentRefundId] = useState(refundId);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const amountLabel = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 2,
    }).format(amount);

    const isPaid = paymentStatus === "PAID";
    const refundIsUnresolved =
        refundStatus === "PENDING" ||
        refundStatus === "PROCESSING";

    const refundNeedsReview =
        refundStatus === "FAILED" && Boolean(currentRefundId);

    const alreadyRefunded =
        paymentStatus === "REFUNDED" ||
        refundStatus === "SUCCEEDED";

    const canSubmit =
        isPaid &&
        Boolean(paymentId) &&
        !refundIsUnresolved &&
        !refundNeedsReview &&
        !alreadyRefunded;

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setMessage("");
        setSuccess(false);

        if (justification.trim().length < 10) {
            setMessage("Please provide a justification of at least 10 characters.");
            return;
        }

        if (!canSubmit) {
            setMessage("This booking is not currently eligible for a refund.");
            return;
        }

        const confirmed = window.confirm(`Confirm a FULL refund of ${amountLabel} for booking ${bookingRef}? This action cannot be undone once processed.`);

        if (!confirmed) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `/api/bookings/${bookingId}/refund`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        reason,
                        justification: justification.trim(),
                    }),
                }
            );

            const result = await response.json();

            if (result.refundStatus) {
                setRefundStatus(result.refundStatus as PayMongoRefundStatus);
            }
            if (result.refundId) {
                setCurrentRefundId(result.refundId);
            }
            if (!response.ok) {
                setSuccess(false);
                setMessage(result.error || "Unable to process the refund.");
                return;
            }

            setSuccess(true);
            setMessage(result.message || "Refund request submitted.");
            setJustification("");
        } catch {
            setMessage("A network error occurred. Check the refund status before trying again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <section className="rounded-xl border border-stone-200 bg-white p-5">
                <h2 className="font-semibold text-stone-900">
                    Booking and payment details
                </h2>
                <dl className="mt-4 space-y-4 text-sm">
                    <div>
                        <dt className="text-stone-500">
                            Booking reference
                        </dt>
                        <dd className="mt-1 font-semibold text-stone-900">
                            {bookingRef}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-stone-500">Guest</dt>
                        <dd className="mt-1 font-medium text-stone-900">
                            {guestName}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-stone-500">
                            Booking status
                        </dt>
                        <dd className="mt-1 font-medium text-stone-900">
                            {bookingStatus}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-stone-500">
                            Payment status
                        </dt>
                        <dd className="mt-1 font-medium text-stone-900">
                            {paymentStatus}
                        </dd>
                    </div>
                    <div className="border-t border-stone-200 pt-4">
                        <dt className="text-stone-500">
                            Full refund amount
                        </dt>
                        <dd className="mt-1 text-2xl font-bold text-stone-900">
                            {amountLabel}
                        </dd>
                    </div>
                    {currentRefundId && (
                        <div>
                            <dt className="text-stone-500">
                                PayMongo refund ID
                            </dt>
                            <dd className="mt-1 break-all font-mono text-xs text-stone-700">
                                {currentRefundId}
                            </dd>
                        </div>
                    )}
                </dl>
            </section>

            {refundStatus && (
                <section
                    aria-live="polite"
                    className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                    <p className="text-sm text-stone-500">
                        Refund status
                    </p>
                    <p className="mt-1 font-semibold text-stone-900">
                        {statusLabels[refundStatus] ?? refundStatus}
                    </p>
                </section>
            )}

            {alreadyRefunded ? (
                <p className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
                    This payment has already been refunded. Another
                    refund cannot be submitted.
                </p>
            ) : refundIsUnresolved ? (
                <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                    This refund is unresolved. Wait for PayMongo to
                    update its status before taking further action.
                </p>
            ) : refundNeedsReview ? (
                <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                    The previous refund failed but has a PayMongo
                    refund ID. Reconcile the refund with PayMongo
                    before attempting another one.
                </p>
            ) : !isPaid ? (
                <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                    Only paid bookings are eligible for a refund.
                </p>
            ) : !paymentId ? (
                <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                    The PayMongo payment ID is missing. Verify the
                    payment before proceeding.
                </p>
            ) : null}

            {canSubmit && (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-xl border border-stone-200 bg-white p-5">
                    <div>
                        <label
                            htmlFor="refund-reason"
                            className="mb-2 block text-sm font-medium text-stone-700">
                            Refund reason
                        </label>
                        <select
                            id="refund-reason"
                            value={reason}
                            onChange={(event) =>
                                setReason(event.target.value)
                            }
                            className="w-full rounded-lg border border-stone-300 bg-white p-3"
                            required>
                            {refundReasons.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor="refund-justification"
                            className="mb-2 block text-sm font-medium text-stone-700">
                            Admin justification
                        </label>
                        <textarea
                            id="refund-justification"
                            value={justification}
                            onChange={(event) =>
                                setJustification(event.target.value)
                            }
                            minLength={10}
                            maxLength={1000}
                            rows={4}
                            placeholder="Explain why this refund is necessary..."
                            className="w-full rounded-lg border border-stone-300 p-3"
                            required
                        />
                        <p className="mt-1 text-xs text-stone-500">
                            Recorded in the booking audit trail. Enter
                            between 10 and 1000 characters.
                        </p>
                    </div>
                    {message && (
                        <p
                            role="alert"
                            className={`rounded-lg p-3 text-sm ${success
                                ? "bg-green-50 text-green-800"
                                : "bg-red-50 text-red-800"
                                }`}>
                            {message}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={
                            loading ||
                            justification.trim().length < 10
                        }
                        className="w-full rounded-lg bg-[var(--color-forest-800)] px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                        {loading
                            ? "Submitting refund..."
                            : `Confirm full refund · ${amountLabel}`}
                    </button>
                </form>
            )}

            {!canSubmit && message && (
                <p
                    role="alert"
                    className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                    {message}
                </p>
            )}
        </div>
    );
}