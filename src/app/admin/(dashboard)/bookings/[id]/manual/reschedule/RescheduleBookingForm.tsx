"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import ConfirmationModal from "@/components/reusable/ConfirmationModal";

interface RescheduleBookingFormProps {
    roomId: number;
    bookingId: number;
    currentCheckIn: string;
    currentCheckOut: string;
    minimumCheckIn: string;
}
type UnavailableRange = {
    checkIn: string;
    checkOut: string;
};
function dateToKey(date: Date): string {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);
    const year = parts.find((part) => part.type === "year")!.value;
    const month = parts.find((part) => part.type === "month")!.value;
    const day = parts.find((part) => part.type === "day")!.value;
    return `${year}-${month}-${day}`;
}

function keyToDate(key: string): Date {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, 12));
}

export default function RescheduleBookingForm({
    roomId,
    bookingId,
    currentCheckIn,
    currentCheckOut,
    minimumCheckIn,
}: RescheduleBookingFormProps) {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [activeDatePicker, setActiveDatePicker] = useState<"checkIn" | "checkOut" | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [unavailableRanges, setUnavailableRanges] = useState<UnavailableRange[]>([]);
    const [availabilityLoading, setAvailabilityLoading] = useState(true);
    const [availabilityError, setAvailabilityError] = useState("");
    const router = useRouter();
    const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
    useEffect(() => {
        let cancelled = false;
        async function fetchAvailability() {
            setAvailabilityLoading(true);
            setAvailabilityError("");
            try {
                const response = await fetch(
                    `/api/rooms/${roomId}/availability?excludeBookingId=${bookingId}`,
                    { cache: "no-store" },
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || "Unable to load availability.");
                }
                if (!cancelled) {
                    setUnavailableRanges(data.unavailableRanges);
                }
            } catch {
                if (!cancelled) {
                    setAvailabilityError("Unable to load room availability. Please try again.");
                }
            } finally {
                if (!cancelled) {
                    setAvailabilityLoading(false);
                }
            }
        }
        void fetchAvailability();
        return () => {
            cancelled = true;
        };
    }, [roomId, bookingId]);
    const originalNights = (Date.parse(`${currentCheckOut}T00:00:00Z`) - Date.parse(`${currentCheckIn}T00:00:00Z`)) / (1000 * 60 * 60 * 24);

    const datesAreValid = checkIn >= minimumCheckIn && checkOut > checkIn && (Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / (1000 * 60 * 60 * 24) === originalNights;
    const isCheckInUnavailable = (date: Date): boolean => {
        const dateKey = dateToKey(date);
        return unavailableRanges.some(
            (range) => range.checkIn <= dateKey && dateKey < range.checkOut,
        );
    };

    const isCheckoutUnavailable = (
        checkoutKey: string,
        checkInKey: string,
    ): boolean => {
        if (checkoutKey <= checkInKey) return true;

        return unavailableRanges.some(
            (range) =>
                range.checkIn < checkoutKey &&
                range.checkOut > checkInKey,
        );
    };
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
            <section className="rounded-xl border border-green-200 bg-green-50 p-5">
                <h2 className="font-semibold text-green-900">
                    Booking rescheduled successfully
                </h2>
                <Link
                    href={`/admin/bookings/${bookingId}`}
                    className="mt-4 inline-block text-sm font-medium text-green-900 underline hover:text-green-950">
                    View booking details →
                </Link>
            </section>
        );
    }
    return (
        <section className="rounded-xl border border-stone-200 bg-white p-5 pb-10">
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="relative flex flex-col">
                    <label
                        htmlFor="reschedule-check-in"
                        className="mb-2 block text-sm font-medium text-stone-700">
                        New check-in
                    </label>

                    <button
                        id="reschedule-check-in"
                        type="button"
                        onClick={() => setActiveDatePicker(activeDatePicker === "checkIn" ? null : "checkIn")}
                        className="w-full rounded-lg border border-stone-300 bg-white p-3 text-left text-sm text-stone-700 outline-none transition-colors hover:cursor-pointer focus:border-[var(--color-forest-500)] focus:ring-2 focus:ring-[var(--color-forest-500)]">
                        {checkIn || "Select check-in date"}
                    </button>

                    {activeDatePicker === "checkIn" && (
                        <div className="absolute bottom-full left-0 z-30 mb-2 rounded-xl border border-stone-200 bg-white p-3 shadow-xl">
                            <DayPicker
                                mode="single"
                                selected={checkIn ? keyToDate(checkIn) : undefined}
                                disabled={(date) =>
                                    dateToKey(date) < minimumCheckIn ||
                                    dateToKey(date) === currentCheckIn ||
                                    isCheckInUnavailable(date) ||
                                    availabilityLoading ||
                                    !!availabilityError
                                }
                                onSelect={(date) => {
                                    if (!date) return;
                                    const newCheckIn = dateToKey(date);
                                    const newCheckInDate = keyToDate(newCheckIn);
                                    newCheckInDate.setUTCDate(
                                        newCheckInDate.getUTCDate() + originalNights,
                                    );
                                    const newCheckOut = dateToKey(newCheckInDate);
                                    setCheckIn(newCheckIn);
                                    setCheckOut(newCheckOut);
                                    setError("");
                                    setActiveDatePicker(null);
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="relative flex flex-col">
                    <label
                        htmlFor="reschedule-check-out"
                        className="mb-2 block text-sm font-medium text-stone-700">
                        New check-out
                    </label>

                    <button
                        id="reschedule-check-out"
                        type="button"
                        onClick={() => {
                            if (checkIn) {
                                setActiveDatePicker(activeDatePicker === "checkOut" ? null : "checkOut");
                            }
                        }}
                        disabled={!checkIn}
                        className="w-full rounded-lg border border-stone-300 bg-white p-3 text-left text-sm text-stone-700 outline-none transition-colors hover:cursor-pointer focus:border-[var(--color-forest-500)] focus:ring-2 focus:ring-[var(--color-forest-500)] disabled:cursor-not-allowed disabled:opacity-50">
                        {checkOut || "Select check-out date"}
                    </button>

                    {activeDatePicker === "checkOut" && checkIn && (
                        <div className="absolute bottom-full left-0 z-30 mb-2 rounded-xl border border-stone-200 bg-white p-3 shadow-xl">
                            <DayPicker
                                mode="single"
                                selected={checkOut ? keyToDate(checkOut) : undefined}
                                disabled={(date) => dateToKey(date) <= checkIn || isCheckoutUnavailable(dateToKey(date), checkIn) || availabilityLoading || !!availabilityError}
                                onSelect={(date) => {
                                    if (!date) return;
                                    const newCheckOut = dateToKey(date);
                                    if (newCheckOut > checkIn) {
                                        setCheckOut(newCheckOut);
                                        setError("");
                                        setActiveDatePicker(null);
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
            <p className="mt-3 text-xs text-stone-500">
                Check-in must be at least tomorrow
                <br />
                and length of stay must be the same.
            </p>
            {availabilityLoading && (
                <p className="mt-2 text-sm text-stone-500">
                    Loading room availability...
                </p>
            )}

            {availabilityError && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                    {availabilityError}
                </p>
            )}
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
                    onClick={() => setIsConfirmingCancel(true)}
                    className="rounded-lg border border-stone-300 px-5 py-3 text-center text-sm font-medium text-stone-700 transition hover:cursor-pointer bg-stone-50">
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setError("");
                        setIsConfirming(true);
                    }}
                    disabled={!datesAreValid || loading}
                    className="rounded-lg bg-[var(--color-forest-800)] px-5 py-3 text-sm font-medium text-white transition hover:cursor-pointer bg-[var(--color-forest-900)] disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                        backgroundColor: "var(--color-forest-700)",
                    }}>
                    Reschedule Booking
                </button>
            </div>
            <ConfirmationModal
                isOpen={isConfirmingCancel}
                title="Discard Changes?"
                description="Are you sure you want to leave this page? Any changes you have made will be lost."
                confirmLabel="Leave Page"
                cancelLabel="Stay in this page"
                confirmPosition="left"
                onCancel={() => setIsConfirmingCancel(false)}
                onConfirm={() => {
                    setIsConfirmingCancel(false);
                    router.back();
                }}
            />
            <ConfirmationModal
                isOpen={isConfirming}
                title="Confirm Rescheduling"
                description={`Are you sure you want to change this booking to check in on ${checkIn} and check out on ${checkOut}?`}
                confirmLabel="Confirm Reschedule"
                isLoading={loading}
                onCancel={() => setIsConfirming(false)}
                onConfirm={handleReschedule}
            />
        </section>
    );
}