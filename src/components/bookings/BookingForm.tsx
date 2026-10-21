"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Room } from "@/types/room";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { DayPicker } from "react-day-picker";

type BookingFormProps = {
    rooms: Room[];
};
type UnavailableRange = {
    checkIn: string;
    checkOut: string;
};
function dateToKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
function keyToDate(key: string): Date {
    const [year, month, day] = key.split("-").map(Number);

    return new Date(year, month - 1, day, 12);
}
export default function BookingForm({ rooms }: BookingFormProps) {
    const [activeDatePicker, setActiveDatePicker] = useState<"checkIn" | "checkOut" | null>(null);
    const [unavailableRanges, setUnavailableRanges] = useState<UnavailableRange[]>([]);
    const [availabilityLoading, setAvailabilityLoading] = useState(false);
    const [availabilityError, setAvailabilityError] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState("");
    const [bookingMessage, setBookingMessage] = useState("");
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const minimumCheckInDate = today
        .toISOString()
        .split("T")[0];
    const [selectedRoomId, setSelectedRoomId] = useState(
        rooms[0]?.id ?? 0
    );
    const selectedRoom = rooms.find(
        (room) => room.id === selectedRoomId
    );
    const isCheckInUnavailable = (date: Date): boolean => {
        const dateKey = dateToKey(date);
        return unavailableRanges.some(
            (range) => range.checkIn <= dateKey && dateKey < range.checkOut
        );
    };
    const isCheckoutUnavailable = (
        checkoutKey: string,
        checkInKey: string
    ): boolean => {
        if (checkoutKey <= checkInKey) {
            return true;
        }
        return unavailableRanges.some(
            (range) =>
                range.checkIn < checkoutKey &&
                range.checkOut > checkInKey
        );
    };

    useEffect(() => {
        if (!selectedRoomId) {
            return;
        }
        let cancelled = false;
        async function fetchAvailability() {
            setAvailabilityLoading(true);
            setAvailabilityError("");
            setUnavailableRanges([]);
            setCheckIn("");
            setCheckOut("");
            setActiveDatePicker(null);
            try {
                const response = await fetch(
                    `/api/rooms/${selectedRoomId}/availability`,
                    { cache: "no-store" }
                );
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(
                        result.error || "Unable to retrieve availability."
                    );
                }
                if (!cancelled) {
                    setUnavailableRanges(result.unavailableRanges);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Availability fetch failed:", error);
                    setAvailabilityError(
                        "Unable to load availability. Please try again."
                    );
                }
            } finally {
                if (!cancelled) {
                    setAvailabilityLoading(false);
                }
            }
        }
        fetchAvailability();
        return () => {
            cancelled = true;
        };
    }, [selectedRoomId]);
    const nights = Math.max(
        1,
        Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
    );
    const subtotal = selectedRoom
        ? Number(selectedRoom.price) * nights
        : 0;
    const handleConfirmBooking = async () => {
        if (isSubmitting) return;
        setApiError("");
        setBookingMessage("");
        const newErrors: Record<string, string> = {};
        if (!selectedRoom) {
            newErrors.room = "Please select an accommodation.";
        }
        if (!checkIn || !checkOut) {
            newErrors.dates = "Please select both dates.";
        } else {
            const checkInDate = new Date(`${checkIn}T00:00:00`);
            const checkOutDate = new Date(`${checkOut}T00:00:00`);
            const tomorrow = new Date();
            tomorrow.setHours(0, 0, 0, 0);
            tomorrow.setDate(tomorrow.getDate() + 1);
            if (checkInDate < tomorrow) {
                newErrors.checkIn = "Check-in must be at least tomorrow.";
            }
            if (checkOutDate <= checkInDate) {
                newErrors.checkOut =
                    "Check-out must be at least one day after check-in.";
            }
        }
        if (!firstName.trim()) {
            newErrors.firstName = "Please enter your first name.";
        }
        if (!lastName.trim()) {
            newErrors.lastName = "Please enter your last name.";
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = "Please enter your email address.";
        } else if (!emailPattern.test(email.trim())) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!phone.trim()) {
            newErrors.phone = "Please enter your phone number.";
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomId: selectedRoom!.id,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    checkIn,
                    checkOut,
                    specialRequests,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                setApiError(
                    result.error || "Unable to create your booking. Please try again."
                );
                return;
            }
            if (typeof result.checkoutUrl !== "string") {
                setApiError(
                    "Payment checkout could not be opened. Please contact the resort before trying again."
                );
                return;
            }
            window.location.assign(result.checkoutUrl);

        } catch (error) {
            console.error("Booking submission failed:", error);
            setApiError(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-16 bg-[var(--color-bg)]">
            <section className="px-4 py-12 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
                <h1
                    className="text-4xl md:text-5xl font-bold mb-4"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-forest-900)" }}>
                    Reserve Your Stay
                </h1>
                <p className="text-lg text-stone-600 mb-8">
                    Complete the details below to secure your mountain getaway.
                </p>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--color-border)]">
                            <div className="mb-12">
                                <h3 className="text-xl font-bold mb-6 text-[var(--color-forest-900)] flex items-center">
                                    <span className="w-6 h-6 rounded-full bg-[var(--color-forest-100)] text-[var(--color-forest-800)] flex items-center justify-center text-xs mr-3">1</span>
                                    Stay Details
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            Select Accommodation
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={selectedRoomId}
                                                onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                                                className="w-full appearance-none border-stone-300 rounded-lg p-3 pr-10 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none transition-colors hover:cursor-pointer">
                                                {rooms.map((room) => (
                                                    <option key={room.id} value={room.id}>
                                                        {room.name} - ₱{room.price}/night
                                                    </option>
                                                ))}
                                            </select>
                                            <svg
                                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500"
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col relative">
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                Check-in Date
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveDatePicker(
                                                        activeDatePicker === "checkIn" ? null : "checkIn"
                                                    )
                                                }
                                                disabled={availabilityLoading || !!availabilityError}
                                                className="w-full border-stone-300 rounded-lg p-3 border focus:ring-2 focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none text-left bg-white text-stone-700 disabled:opacity-50">
                                                {checkIn || "Select check-in date"}
                                            </button>
                                            <p className="mt-1 text-xs text-stone-500 leading-relaxed">
                                                Check-in must be a day after today. We thoroughly prepare the
                                                space for your visit. Greyed-out dates are taken.
                                            </p>
                                            {activeDatePicker === "checkIn" && (
                                                <div className="absolute left-0 top-full z-30 mt-2 rounded-xl border border-stone-200 bg-white p-3 shadow-xl">
                                                    <DayPicker
                                                        mode="single"
                                                        selected={checkIn ? keyToDate(checkIn) : undefined}
                                                        disabled={(date) =>
                                                            dateToKey(date) < minimumCheckInDate ||
                                                            isCheckInUnavailable(date) ||
                                                            availabilityLoading ||
                                                            !!availabilityError
                                                        }
                                                        onSelect={(date) => {
                                                            if (!date) return;
                                                            const newCheckIn = dateToKey(date);
                                                            setCheckIn(newCheckIn);
                                                            if (
                                                                !checkOut ||
                                                                checkOut <= newCheckIn ||
                                                                isCheckoutUnavailable(checkOut, newCheckIn)
                                                            ) {
                                                                setCheckOut("");
                                                            }
                                                            setActiveDatePicker(null);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col relative">
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                Check-out Date
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    checkIn &&
                                                    setActiveDatePicker(
                                                        activeDatePicker === "checkOut" ? null : "checkOut"
                                                    )
                                                }
                                                disabled={
                                                    !checkIn ||
                                                    availabilityLoading ||
                                                    !!availabilityError
                                                }
                                                className="w-full border-stone-300 rounded-lg p-3 border focus:ring-2 focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none text-left bg-white text-stone-700 disabled:opacity-50">
                                                {checkOut || "Select check-out date"}
                                            </button>
                                            {activeDatePicker === "checkOut" && checkIn && (
                                                <div className="absolute left-0 top-full z-30 mt-2 rounded-xl border border-stone-200 bg-white p-3 shadow-xl">
                                                    <DayPicker
                                                        mode="single"
                                                        selected={checkOut ? keyToDate(checkOut) : undefined}
                                                        disabled={(date) =>
                                                            dateToKey(date) <= checkIn ||
                                                            isCheckoutUnavailable(dateToKey(date), checkIn) ||
                                                            availabilityLoading ||
                                                            !!availabilityError
                                                        }
                                                        onSelect={(date) => {
                                                            if (!date || !checkIn) return;

                                                            const newCheckOut = dateToKey(date);

                                                            if (
                                                                !isCheckoutUnavailable(newCheckOut, checkIn)
                                                            ) {
                                                                setCheckOut(newCheckOut);
                                                                setActiveDatePicker(null);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8 pt-8 border-t border-[var(--color-border)]">
                                <h3 className="text-xl font-bold mb-6 text-[var(--color-forest-900)] flex items-center">
                                    <span className="w-6 h-6 rounded-full bg-[var(--color-forest-100)] text-[var(--color-forest-800)] flex items-center justify-center text-xs mr-3">2</span>
                                    Guest Information
                                </h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-2">First Name</label>
                                            <input
                                                type="text"
                                                placeholder="Alexander"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                placeholder="McKenie"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                placeholder="exurb1a@gmail.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-2">Phone Number</label>
                                            <PhoneInput
                                                defaultCountry="ph"
                                                value={phone}
                                                onChange={(phone) => setPhone(phone)}
                                                placeholder="912 345 6789"
                                                className="phone-input-wrapper w-full"
                                                inputClassName="!w-full !h-auto !flex-1 !border-0 !bg-transparent !p-3 !text-base !text-stone-900 !outline-none !shadow-none"
                                                countrySelectorStyleProps={{
                                                    buttonClassName:
                                                        "!h-full !border-0 !bg-transparent !px-3 !rounded-l-lg",
                                                    dropdownStyleProps: {
                                                        className: "!text-sm",
                                                    },
                                                }}
                                                style={{
                                                    width: "100%",
                                                    border: "1px solid #d6d3d1",
                                                    borderRadius: "0.5rem",
                                                    overflow: "visible",
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">Special Requests (Optional)</label>
                                        <textarea
                                            rows={4}
                                            value={specialRequests}
                                            onChange={(e) => setSpecialRequests(e.target.value)}
                                            placeholder="Any dietary requirements or special arrangements?"
                                            className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] sticky top-24">
                            <h3 className="text-xl font-bold mb-6 text-[var(--color-forest-900)] border-b border-[var(--color-border)] pb-4">
                                Booking Summary
                            </h3>
                            <div className="mb-6">
                                {selectedRoom && (
                                    <div className="mb-6">
                                        <div className="relative mb-4 h-40 overflow-hidden rounded-xl">
                                            <Image
                                                src={selectedRoom.image}
                                                alt={selectedRoom.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <h4 className="font-bold text-lg text-stone-800">
                                            {selectedRoom.name}
                                        </h4>
                                        <div className="flex items-center text-sm text-stone-500 mt-1">
                                            Max Guests: {selectedRoom.maxGuests}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 text-sm mb-6 border-b border-[var(--color-border)] pb-6">
                                <div className="flex justify-between">
                                    <span className="text-stone-600">Check-in</span>
                                    <span className="font-semibold text-stone-800">{checkIn}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-600">Check-out</span>
                                    <span className="font-semibold text-stone-800">{checkOut}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone-600">Length of stay</span>
                                    {checkIn && checkOut && (
                                        <span className="font-semibold text-stone-800">
                                            {nights} {nights === 1 ? "night" : "nights"}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="font-bold text-lg text-stone-800">Total Price</span>
                                {checkIn && checkOut && (
                                    <span className="font-bold text-2xl text-[var(--color-forest-900)]">
                                        ₱{subtotal.toLocaleString("en-PH")}
                                    </span>
                                )}
                            </div>
                            {Object.keys(errors).length > 0 && (
                                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                    <ul className="list-disc space-y-1 pl-5">
                                        {Object.values(errors).map((message, index) => (
                                            <li key={index}>{message}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {apiError && (
                                <p role="alert" className="mb-4 text-sm text-red-600">
                                    {apiError}
                                </p>
                            )}
                            {bookingMessage && (
                                <p role="status" className="mb-4 text-sm text-green-700">
                                    {bookingMessage}
                                </p>
                            )}
                            <button
                                type="button"
                                onClick={handleConfirmBooking}
                                disabled={isSubmitting}
                                className="w-full bg-[var(--color-forest-800)] text-white py-4 rounded-xl font-bold text-lg hover:bg-[var(--color-forest-700)] transition-colors shadow-lg hover:shadow-xl active:scale-[0.98] hover:cursor-pointer"
                                style={{
                                    background:
                                        "var(--color-forest-600)",
                                    color: "white",
                                }}>
                                {isSubmitting ? "Creating Booking..." : "Confirm Booking"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}