"use client";
import { useState } from "react";

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

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getTodayKey() {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());
    const values = Object.fromEntries(
        parts.map((part) => [part.type, part.value])
    );
    return `${values.year}-${values.month}-${values.day}`;
}

export default function RoomAvailabilityCalendar({
    rooms,
    bookings,
}: Props) {
    const [month, setMonth] = useState(() => {
        const now = new Date();

        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const todayKey = getTodayKey();
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstWeekday = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const currentMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    );
    const isCurrentMonth =
        year === currentMonth.getFullYear() &&
        monthIndex === currentMonth.getMonth();
    const monthLabel = month.toLocaleDateString("en-PH", {
        month: "long",
        year: "numeric",
    });

    function getDayStatus(roomId: number, dateKey: string) {
        if (dateKey < todayKey) {
            return "past";
        }
        const booking = bookings.find(
            (item) =>
                item.roomId === roomId &&
                item.checkIn <= dateKey &&
                dateKey < item.checkOut
        );
        if (!booking) {
            return "available";
        }

        return booking.status === "CONFIRMED"
            ? "confirmed"
            : "pending";
    }

    const statusStyles = {
        past: "bg-gray-100 text-gray-400",
        available:
            "bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
        confirmed: "bg-rose-100 text-rose-800",
        pending: "bg-amber-100 text-amber-800",
    };

    return (
        <section
            className="rounded-xl border bg-white p-5 shadow-sm sm:p-6"
            style={{ borderColor: "var(--color-border)" }}>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2
                        className="text-lg font-semibold"
                        style={{ color: "var(--color-forest-900)" }}>
                        Room Availability
                    </h2>
                    <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--color-muted)" }}>
                        View booked and available dates for each room.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            setMonth(
                                new Date(year, monthIndex - 1, 1)
                            )
                        }
                        disabled={isCurrentMonth}
                        className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover: cursor-pointer"
                        style={{ borderColor: "var(--color-border)" }}
                        aria-label="Previous month">
                        &larr;
                    </button>

                    <span
                        className="min-w-32 text-center text-sm font-semibold"
                        style={{ color: "var(--color-forest-900)" }}>
                        {monthLabel}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setMonth(
                                new Date(year, monthIndex + 1, 1)
                            )
                        }
                        className="rounded-lg border px-3 py-2 text-sm hover: cursor-pointer"
                        style={{ borderColor: "var(--color-border)" }}
                        aria-label="Next month">
                        &rarr;
                    </button>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs">
                <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-emerald-200" />
                    Available
                </span>

                <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-rose-200" />
                    Confirmed booking
                </span>

                <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-amber-200" />
                    Awaiting payment
                </span>

                <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-gray-200" />
                    Past date
                </span>
            </div>

            {rooms.length === 0 ? (
                <p
                    className="py-10 text-center text-sm"
                    style={{ color: "var(--color-muted)" }}>
                    No rooms have been added yet.
                </p>
            ) : (
                <div className="mt-6 space-y-8">
                    {rooms.map((room) => (
                        <div key={room.id}>
                            <h3
                                className="mb-3 font-semibold"
                                style={{
                                    color: "var(--color-forest-900)",
                                }}>
                                {room.name}
                            </h3>

                            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                                {weekdays.map((day) => (
                                    <div
                                        key={day}
                                        className="py-1 text-center text-xs font-medium text-gray-500">
                                        {day}
                                    </div>
                                ))}

                                {Array.from(
                                    { length: firstWeekday },
                                    (_, index) => (
                                        <div
                                            key={`empty-${index}`}
                                            aria-hidden="true"
                                        />
                                    )
                                )}

                                {Array.from(
                                    { length: daysInMonth },
                                    (_, index) => {
                                        const day = index + 1;
                                        const dateKey = getDateKey(
                                            new Date(
                                                year,
                                                monthIndex,
                                                day
                                            )
                                        );
                                        const status = getDayStatus(
                                            room.id,
                                            dateKey
                                        );
                                        const labels = {
                                            past: "Past date",
                                            available: "Available",
                                            confirmed: "Confirmed booking",
                                            pending: "Awaiting payment",
                                        };
                                        return (
                                            <div
                                                key={dateKey}
                                                title={`${dateKey}: ${labels[status]}`}
                                                aria-label={`${dateKey}: ${labels[status]}`}
                                                className={`flex aspect-square min-h-8 items-center justify-center rounded-md text-xs font-medium sm:min-h-10 sm:text-sm ${statusStyles[status]}`}
                                            >
                                                {day}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}