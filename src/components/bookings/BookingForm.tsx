"use client";
import Image from "next/image";
import { useState } from "react";
import type { Room } from "@/types/room";

type BookingFormProps = {
    rooms: Room[];
};

export default function BookingForm({ rooms }: BookingFormProps) {

    const [step, setStep] = useState(1);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [checkIn, setCheckIn] = useState("2026-10-15");
    const [checkOut, setCheckOut] = useState("2026-10-17");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");

    const today = new Date();
    today.setDate(today.getDate() + 1);
    const minimumCheckInDate = today
        .toISOString()
        .split("T")[0];
    const minimumCheckOut = new Date(checkIn);
    minimumCheckOut.setDate(minimumCheckOut.getDate() + 1);
    const minimumCheckOutDate = minimumCheckOut
        .toISOString()
        .split("T")[0];

    const [selectedRoomId, setSelectedRoomId] = useState(
        rooms[0]?.id ?? 0
    );
    const selectedRoom = rooms.find(
        (room) => room.id === selectedRoomId
    );
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

                <div className="flex items-center justify-center max-w-md mx-auto mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-[var(--color-forest-800)] text-white' : 'bg-stone-200 text-stone-500'
                                }`}>
                                {s}
                            </div>
                            {s < 3 && (
                                <div className={`w-16 h-1 mx-2 rounded ${step > s ? 'bg-[var(--color-forest-800)]' : 'bg-stone-200'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
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
                                        <label className="block text-sm font-medium text-stone-700 mb-2">Select Accommodation</label>
                                        <select
                                            value={selectedRoomId}
                                            onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                                            className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none transition-colors hover: cursor-pointer">
                                            {rooms.map((room) => (
                                                <option key={room.id} value={room.id}>
                                                    {room.name} - ₱{room.price}/night
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col">
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                Check-in Date
                                            </label>
                                            <input
                                                value={checkIn}
                                                onChange={(e) => {
                                                    const newCheckIn =
                                                        e.target.value;
                                                    setCheckIn(newCheckIn);
                                                    const nextDay =
                                                        new Date(newCheckIn);
                                                    nextDay.setDate(
                                                        nextDay.getDate() + 1
                                                    );
                                                    const newMinimumCheckOut =
                                                        nextDay
                                                            .toISOString()
                                                            .split("T")[0];
                                                    if (
                                                        checkOut <
                                                        newMinimumCheckOut
                                                    ) {
                                                        setCheckOut(
                                                            newMinimumCheckOut
                                                        );
                                                    }
                                                }}
                                                type="date"
                                                min={minimumCheckInDate}
                                                className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none"
                                            />
                                            <p className="mt-1 text-xs text-stone-500 leading-relaxed">
                                                Check-in must be a day after today. We thoroughly prepare the space for your visit.
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-2">Check-out Date</label>
                                            <input
                                                value={checkOut}
                                                onChange={(e) =>
                                                    setCheckOut(
                                                        e.target.value
                                                    )
                                                }
                                                min={minimumCheckOutDate}
                                                type="date"
                                                className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <div className="col-span-2 md:col-span-2">
                                            <label className="block text-sm font-medium text-stone-700 mb-2">Adults</label>
                                            <select
                                                value={adults}
                                                onChange={(e) => setAdults(Number(e.target.value))}
                                                className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none transition-colors">
                                                {[1, 2, 3, 4, 5, 6].map(n => <option key={n}>{n}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-2 md:col-span-2">
                                            <label className="block text-sm font-medium text-stone-700 mb-2">Children</label>
                                            <select
                                                value={children}
                                                onChange={(e) => setChildren(Number(e.target.value))}
                                                className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none transition-colors">
                                                {[0, 1, 2, 3, 4].map(n => <option key={n}>{n}</option>)}
                                            </select>
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
                                            <input
                                                type="tel"
                                                placeholder="+63 912 345 6789"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none" />
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
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                />
                                            </svg>
                                            {adults} Adults, {children} Children
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
                                    <span className="font-semibold text-stone-800">{nights} {nights === 1 ? "night" : "nights"}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="font-bold text-lg text-stone-800">Total Price</span>
                                <span className="font-bold text-2xl text-[var(--color-forest-900)]">₱{subtotal.toLocaleString("en-PH")}</span>
                            </div>

                            <button className="w-full bg-[var(--color-forest-800)] text-white py-4 rounded-xl font-bold text-lg hover:bg-[var(--color-forest-700)] transition-colors shadow-lg hover:shadow-xl active:scale-[0.98]">
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}