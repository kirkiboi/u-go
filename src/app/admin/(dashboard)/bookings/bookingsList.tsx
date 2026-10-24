"use client";
import { useMemo, useState } from "react";
import type { Prisma } from "@prisma/client";
import Link from "next/link";

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
        case "CHECKED_IN":
            return {
                backgroundColor: "#dcfce7",
                color: "#166534",
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
    const [statusFilter, setStatusFilter] = useState("CONFIRMED");
    const [dateFilter, setDateFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 6;
    const filteredBookings = useMemo(() => {
        const query = search.trim().toLowerCase();
        const today = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Manila",
        }).format(new Date());

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
    const totalPages = Math.ceil(
        filteredBookings.length / bookingsPerPage
    );
    const safeCurrentPage = Math.min(
        currentPage,
        Math.max(1, totalPages)
    );
    const paginatedBookings = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * bookingsPerPage;
        return filteredBookings.slice(
            startIndex,
            startIndex + bookingsPerPage
        );
    }, [filteredBookings, safeCurrentPage]);

    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-7xl">
                <div>
                    <p
                        className="text-sm font-medium"
                        style={{
                            color: "var(--color-forest-500)",
                        }}>
                        Booking Management
                    </p>
                    <h1
                        className="mt-1 text-3xl font-bold"
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "var(--color-forest-900)",
                        }}>
                        Booking Overview
                    </h1>
                </div>
                <div
                    className="mt-8 flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm lg:flex-row"
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
                        className="w-full min-w-0 flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                        style={{ borderColor: "var(--color-border)" }}
                    />

                    <div className="relative w-full lg:w-44">
                        <select
                            aria-label="Filter by booking status"
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="w-full appearance-none rounded-lg border border-stone-300 bg-white px-4 py-2.5 pr-10 text-sm outline-none transition-colors hover:cursor-pointer focus:border-[var(--color-forest-500)] focus:ring-[var(--color-forest-500)]"
                            style={{ borderColor: "var(--color-border)" }}>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PENDING">Pending</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CHECKED_IN">Checked In</option>
                            <option value="all">All statuses</option>
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
                    <div className="relative w-full lg:w-40">
                        <select
                            aria-label="Filter by booking date"
                            value={dateFilter}
                            onChange={(event) => setDateFilter(event.target.value)}
                            className="w-full appearance-none rounded-lg border border-stone-300 bg-white px-4 py-2.5 pr-10 text-sm outline-none transition-colors hover:cursor-pointer focus:border-[var(--color-forest-500)] focus:ring-[var(--color-forest-500)]"
                            style={{ borderColor: "var(--color-border)" }}>
                            <option value="all">All dates</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="today">Today</option>
                            <option value="past">Past</option>
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

                {filteredBookings.length > 0 && (
                    <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p
                            className="text-sm"
                            style={{ color: "var(--color-muted)" }}>
                            Showing{" "}
                            {(currentPage - 1) * bookingsPerPage + 1}
                            {"–"}
                            {Math.min(
                                currentPage * bookingsPerPage,
                                filteredBookings.length
                            )}{" "}
                            of {filteredBookings.length} bookings
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setCurrentPage((page) => page - 1)}
                                disabled={currentPage === 1}
                                className="rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover: cursor-pointer bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                style={{ borderColor: "var(--color-border)" }}>
                                Previous
                            </button>
                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    aria-current={currentPage === page ? "page" : undefined}
                                    className="rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover: cursor-pointer"
                                    style={{
                                        borderColor:
                                            currentPage === page
                                                ? "var(--color-forest-500)"
                                                : "var(--color-border)",
                                        backgroundColor:
                                            currentPage === page
                                                ? "var(--color-forest-100)"
                                                : "white",
                                        color:
                                            currentPage === page
                                                ? "var(--color-forest-900)"
                                                : "var(--color-muted)",
                                    }}>
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setCurrentPage((page) => page + 1)}
                                disabled={currentPage === totalPages}
                                className="rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover: cursor-pointer bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                style={{ borderColor: "var(--color-border)" }}>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-3 grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {paginatedBookings.length > 0 ? (
                        paginatedBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                                style={{ borderColor: "var(--color-border)" }}>
                                <div className="flex min-w-0 items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h2
                                            className="truncate text-base font-semibold"
                                            style={{ color: "var(--color-forest-900)" }}>
                                            {booking.guest_fname} {booking.guest_lname}
                                        </h2>
                                        <p
                                            className="mt-1 truncate text-xs"
                                            style={{ color: "var(--color-muted)" }}>
                                            {booking.booking_ref}
                                        </p>
                                    </div>
                                    <span
                                        className="shrink-0 rounded-full px-2 py-1 text-[11px] font-medium"
                                        style={getStatusStyles(booking.status)}>
                                        {booking.status
                                            .replaceAll("_", " ")
                                            .toLowerCase()
                                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                                    </span>
                                </div>
                                <div
                                    className="mt-4 grid grid-cols-2 gap-3 border-t pt-3 sm:grid-cols-3"
                                    style={{ borderColor: "var(--color-border)" }}>
                                    <div className="min-w-0">
                                        <p
                                            className="text-xs"
                                            style={{ color: "var(--color-muted)" }}>
                                            Accommodation
                                        </p>
                                        <p className="mt-1 break-words text-sm font-medium">
                                            {booking.room.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p
                                            className="text-xs"
                                            style={{ color: "var(--color-muted)" }}>
                                            Check-in
                                        </p>
                                        <p className="mt-1 text-sm font-medium">
                                            {booking.check_in.toISOString().slice(0, 10)}
                                        </p>
                                    </div>
                                    <div>
                                        <p
                                            className="text-xs"
                                            style={{ color: "var(--color-muted)" }}>
                                            Check-out
                                        </p>
                                        <p className="mt-1 text-sm font-medium">
                                            {booking.check_out.toISOString().slice(0, 10)}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="mt-4 flex flex-wrap gap-2 border-t pt-3"
                                    style={{ borderColor: "var(--color-border)" }}>
                                    {booking.status === "CONFIRMED" &&
                                        booking.payment_status === "PAID" && (
                                            <Link
                                                href={`/admin/bookings/${booking.id}/check-in`}
                                                className="inline-flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110 sm:flex-none"
                                                style={{
                                                    backgroundColor: "var(--color-forest-700)",
                                                }}>
                                                Check In Guest
                                            </Link>
                                        )}
                                    {booking.status === "CHECKED_IN" && (
                                        <Link
                                            href={`/admin/bookings/${booking.id}/complete`}
                                            className="inline-flex flex-1 items-center justify-center rounded-lg bg-[var(--color-forest-800)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--color-forest-900)] sm:flex-none">
                                            Complete Stay
                                        </Link>
                                    )}
                                    <Link
                                        href={`/admin/bookings/${booking.id}`}
                                        className="inline-flex flex-1 items-center justify-center rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-stone-50 sm:flex-none"
                                        style={{
                                            borderColor: "var(--color-border)",
                                            color: "var(--color-forest-700)",
                                        }}>
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div
                            className="col-span-full rounded-xl border bg-white px-6 py-12 text-center"
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