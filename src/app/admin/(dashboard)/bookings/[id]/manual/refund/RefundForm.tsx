"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { PayMongoRefundStatus } from "@prisma/client";
import ConfirmationModal from "@/components/reusable/ConfirmationModal";
import { useRouter } from "next/navigation";

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
        label: "Duplicate Payment",
    },
    {
        value: "fraudulent",
        label: "Fraudulent Payment",
    },
    {
        value: "others",
        label: "Other Reason",
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
    const [isConfirmingRefund, setIsConfirmingRefund] = useState(false);
    const router = useRouter();
    const [isConfirmingLeave, setIsConfirmingLeave] = useState(false);

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

    async function processRefund() {
        setIsConfirmingRefund(false);
        setMessage("");
        setSuccess(false);

        if (!canSubmit) {
            setMessage("This booking is not currently eligible for a refund.");
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
            setMessage(
                "A network error occurred. Check the refund status before trying again."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");
        setSuccess(false);
        if (justification.trim().length < 2) {
            setMessage(
                "Please provide a message of at least 2 characters. Kindly make sure to include your initials."
            );
            return;
        }
        if (!canSubmit) {
            setMessage("This booking is not currently eligible for a refund.");
            return;
        }
        setIsConfirmingRefund(true);
    }


    return (
        <div className="space-y-6">
            <section className="rounded-xl border border-stone-200 bg-white p-5">
                <h2 className="font-semibold text-stone-900">
                    Booking Details
                </h2>
                <dl className="mt-4 space-y-4 text-sm">
                    <div>
                        <dt className="text-stone-500">
                            Booking Reference
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
                            Booking Status
                        </dt>
                        <dd className="mt-1 font-medium text-stone-900 capitalize">
                            {bookingStatus.replaceAll("_", " ").toLowerCase()}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-stone-500">
                            Payment Status
                        </dt>
                        <dd className="mt-1 font-medium text-stone-900 capitalize">
                            {paymentStatus.replaceAll("_", " ").toLowerCase()}
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
                                PayMongo Refund ID
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
                    This payment has already been refunded.
                </p>
            ) : refundIsUnresolved ? (
                <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                    This refund is pending. Kindly refresh the page. If status did not change, please wait for PayMongo to
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
                        <div className="relative">
                            <select
                                id="refund-reason"
                                value={reason}
                                onChange={(event) => setReason(event.target.value)}
                                className="w-full appearance-none rounded-lg border border-stone-300 bg-white p-3 pr-10 outline-none transition-colors hover:cursor-pointer focus:border-[var(--color-forest-500)] focus:ring-[var(--color-forest-500)]"
                                required>
                                {refundReasons.map((item) => (
                                    <option
                                        key={item.value}
                                        value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            <svg
                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m6 9 6 6 6-6"
                                />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="refund-justification"
                            className="mb-2 block text-sm font-medium text-stone-700">
                            Extra Message
                        </label>
                        <textarea
                            id="refund-justification"
                            value={justification}
                            onChange={(event) =>
                                setJustification(event.target.value)
                            }
                            minLength={2}
                            maxLength={500}
                            rows={4}
                            placeholder="Please provide refundee's name initials (e.g. -RZ)"
                            className="w-full rounded-lg border border-stone-300 p-3"
                            required
                        />
                    </div>
                    {message && (
                        <p
                            role="alert"
                            className={`rounded-lg p-3 text-sm ${success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                            {message}
                        </p>
                    )}
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => setIsConfirmingLeave(true)}
                            disabled={loading}
                            className="rounded-lg border border-stone-300 bg-stone-50 px-5 py-3 text-center text-sm font-medium text-stone-700 transition hover:cursor-pointer hover:cursor-pointer bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50">
                            Leave Page
                        </button>

                        <button
                            type="submit"
                            disabled={loading || justification.trim().length < 2}
                            className="rounded-lg px-5 py-3 text-sm font-medium text-white transition hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            style={{ backgroundColor: "var(--color-forest-800)" }}>
                            {loading ? "Submitting refund..." : `Confirm Refund`}
                        </button>
                    </div>
                </form>
            )
            }

            {
                !canSubmit && message && (
                    <p
                        role="alert"
                        className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                        {message}
                    </p>
                )
            }
            <ConfirmationModal
                isOpen={isConfirmingRefund}
                title="Confirm Full Refund"
                description={`Are you sure you want to issue a full refund of ${amountLabel} for booking ${bookingRef}? This action cannot be undone once processed.`}
                confirmLabel="Confirm Refund"
                cancelLabel="Cancel"
                confirmPosition="right"
                variant="default"
                isLoading={loading}
                onCancel={() => setIsConfirmingRefund(false)}
                onConfirm={() => {
                    void processRefund();
                }}
            />
            <ConfirmationModal
                isOpen={isConfirmingLeave}
                title="Leave Refund Page?"
                description="Are you sure you want to leave this page? Any changes you have made will be lost."
                confirmLabel="Leave Page"
                cancelLabel="Stay on Page"
                confirmPosition="left"
                onCancel={() => setIsConfirmingLeave(false)}
                onConfirm={() => {
                    setIsConfirmingLeave(false);
                    router.push(`/admin/bookings/${bookingId}/manual`);
                }}
            />
        </div >
    );
}