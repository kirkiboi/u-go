"use client";

import { useMemo, useState } from "react";
import type { Prisma } from "@prisma/client";

type BookingWithRoom = Prisma.BookingGetPayload<{
    include: {
        room: {
            select: {
                name: true;
            };
        };
    };
}>;

type BookingsListProps = {
    bookings: BookingWithRoom[];
};

function getStatusStyles(status: string) {
    switch (status) {
        case "CONFIRMED":
            return {
                backgroundColor: "var(--color-forest-100)",
                color: "var(--color-forest-700)",
            };
        case "PENDING":
            return {
                backgroundColor: "#fef3c7",
                color: "#92400e",
            };
        case "COMPLETED":
            return {
                backgroundColor: "#dbeafe",
                color: "#1d4ed8",
            };
        case "CANCELLED":
            return {
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
            };
        default:
            return {
                backgroundColor: "#f3f4f6",
                color: "#4b5563",
            };
    }
}

export default function BookingsList({
    bookings,
}: BookingsListProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");

    const filteredBookings = useMemo(() => {
        const query = search.trim().toLowerCase();
        const now = new Date();
        const today = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0"),
        ].join("-");

        return bookings.filter((booking) => {
            const firstName = booking.guest_fname.toLowerCase();
            const lastName = booking.guest_lname.toLowerCase();
            const fullName = `${firstName} ${lastName}`;
            const reference = booking.booking_ref.toLowerCase();
            const matchesSearch =
                !query ||
                firstName.includes(query) ||
                lastName.includes(query) ||
                fullName.includes(query) ||
                reference.includes(query);
            const matchesStatus =
                statusFilter === "all" ||
                booking.status === statusFilter;
            const checkInDate = booking.check_in
                .toISOString()
                .slice(0, 10);

            const matchesDate =
                dateFilter === "all" ||
                (dateFilter === "upcoming" && checkInDate > today) ||
                (dateFilter === "today" && checkInDate === today) ||
                (dateFilter === "past" && checkInDate < today);

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [bookings, search, statusFilter, dateFilter]);


    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-7xl">
                <div>
                    <p
                        className="w-full text-sm font-medium"
                        style={{ color: "var(--color-forest-500)" }}>
                        Booking Management
                    </p>

                    <h1
                        className="text-2xl font-semibold"
                        style={{ color: "var(--color-forest-900)" }}>
                        Booking Overview
                    </h1>
                </div>

                <div
                    className="mt-8 rounded-xl border bg-white p-4 shadow-sm"
                    style={{ borderColor: "var(--color-border)" }}>
                    <label
                        htmlFor="booking-search"
                        className="sr-only">
                        Search bookings by guest name or reference number
                    </label>

                    <input
                        id="booking-search"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by guest name or booking reference..."
                        autoComplete="off"
                        className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                        style={{ borderColor: "var(--color-border)" }}
                    />

                    <select
                        aria-label="Filter by booking status"
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="rounded-lg border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                        style={{ borderColor: "var(--color-border)" }}>
                        <option value="all">All statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                    <select
                        aria-label="Filter by booking date"
                        value={dateFilter}
                        onChange={(event) => setDateFilter(event.target.value)}
                        className="rounded-lg border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                        style={{ borderColor: "var(--color-border)" }}>
                        <option value="all">All dates</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="today">Today</option>
                        <option value="past">Past</option>
                    </select>
                </div>
                <div className="mt-6">
                    <p
                        className="text-sm"
                        style={{ color: "var(--color-muted)" }}
                        aria-live="polite">
                        {filteredBookings.length}{" "}
                        {filteredBookings.length === 1 ? "booking" : "bookings"}
                        {search.trim() ? " found" : ""}
                    </p>
                </div>
                <div className="mt-3 space-y-4">
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="rounded-xl border bg-white p-6 shadow-sm"
                                style={{ borderColor: "var(--color-border)" }}>
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2
                                                className="text-lg font-semibold"
                                                style={{ color: "var(--color-forest-900)" }}>
                                                {booking.guest_fname} {booking.guest_lname}
                                            </h2>
                                            <span
                                                className="rounded-full px-2.5 py-1 text-xs font-medium"
                                                style={getStatusStyles(booking.status)}>
                                                {booking.status.charAt(0) +
                                                    booking.status.slice(1).toLowerCase()}
                                            </span>
                                        </div>
                                        <p
                                            className="mt-1 text-xs"
                                            style={{ color: "var(--color-muted)" }}>
                                            {booking.booking_ref}
                                        </p>
                                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                            <div>
                                                <p className="mt-1 text-sm font-medium">
                                                    Accommodation
                                                </p>
                                                <p className="text-xs"
                                                    style={{ color: "var(--color-muted)" }}>
                                                    {booking.room.name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="mt-1 text-sm font-medium">
                                                    Stay
                                                </p>
                                                <p className="text-xs"
                                                    style={{ color: "var(--color-muted)" }}>
                                                    {booking.check_in.toISOString().slice(0, 10)}
                                                </p>
                                                <p
                                                    className="text-xs"
                                                    style={{ color: "var(--color-muted)" }}>
                                                    to {booking.check_out.toISOString().slice(0, 10)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="mt-1 text-sm font-semibold"
                                                    style={{ color: "var(--color-forest-700)" }}>
                                                    Total
                                                </p>
                                                <p
                                                    className="text-xs"
                                                    style={{ color: "var(--color-muted)" }}>
                                                    ₱{booking.total.toLocaleString("en-PH")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div
                            className="rounded-xl border bg-white px-6 py-12 text-center"
                            style={{ borderColor: "var(--color-border)" }}>
                            <h2
                                className="text-base font-semibold"
                                style={{ color: "var(--color-forest-900)" }}>
                                No bookings found
                            </h2>
                            <p
                                className="mt-2 text-sm"
                                style={{ color: "var(--color-muted)" }}>
                                Try another guest name or booking reference.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}