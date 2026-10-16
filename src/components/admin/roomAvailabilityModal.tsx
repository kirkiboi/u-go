"use client";

import { useState } from "react";
import RoomAvailabilityCalendar from "./roomAvailabilityCalendar";

type Room = {
    id: number;
    name: string;
};
type RoomBooking = {
    id: number;
    roomId: number;
    checkIn: string;
    checkOut: string;
    status: "CONFIRMED" | "PENDING";
    paymentStatus: "PAID" | "PENDING";
};
type Props = {
    rooms: Room[];
    bookings: RoomBooking[];
};

export default function RoomAvailabilityModal({
    rooms,
    bookings,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full cursor-pointer rounded-xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                    borderColor: "var(--color-border)",
                }}
                aria-haspopup="dialog"
                aria-expanded={isOpen}>
                <p
                    className="text-sm font-medium"
                    style={{ color: "var(--color-muted)" }}>
                    Rooms
                </p>
                <p
                    className="mt-2 text-3xl font-bold"
                    style={{ color: "var(--color-forest-900)" }}>
                    {rooms.length}
                </p>
                <p
                    className="mt-2 text-xs"
                    style={{ color: "var(--color-muted)" }}>
                    Check available dates for available rooms
                </p>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsOpen(false);
                        }
                    }}>
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="room-availability-title"
                        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6">
                        <RoomAvailabilityCalendar
                            rooms={rooms}
                            bookings={bookings}
                        />
                    </div>
                </div>
            )}
        </>
    );
}