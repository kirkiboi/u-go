const bookings = [
    {
        id: "BK-2026-001",
        guestName: "Juan Dela Cruz",
        email: "juan@example.com",
        room: "Cabin House",
        checkIn: "September 28, 2026",
        checkOut: "September 30, 2026",
        guests: 3,
        nights: 2,
        total: "₱5,998",
        status: "Confirmed",
    },
    {
        id: "BK-2026-002",
        guestName: "Maria Santos",
        email: "maria@example.com",
        room: "Mountain View Cottage",
        checkIn: "October 4, 2026",
        checkOut: "October 6, 2026",
        guests: 8,
        nights: 2,
        total: "₱17,998",
        status: "Pending",
    },
    {
        id: "BK-2026-003",
        guestName: "Carlos Reyes",
        email: "carlos@example.com",
        room: "Pinetree House",
        checkIn: "October 10, 2026",
        checkOut: "October 12, 2026",
        guests: 5,
        nights: 2,
        total: "₱9,000",
        status: "Checked In",
    },
    {
        id: "BK-2026-004",
        guestName: "Ana Garcia",
        email: "ana@example.com",
        room: "Cabin House",
        checkIn: "October 15, 2026",
        checkOut: "October 17, 2026",
        guests: 2,
        nights: 2,
        total: "₱5,998",
        status: "Cancelled",
    },
];

function getStatusStyles(status: string) {
    switch (status) {
        case "Confirmed":
            return {
                backgroundColor: "var(--color-forest-100)",
                color: "var(--color-forest-700)",
            };

        case "Pending":
            return {
                backgroundColor: "#fef3c7",
                color: "#92400e",
            };

        case "Checked In":
            return {
                backgroundColor: "#dbeafe",
                color: "#1d4ed8",
            };

        case "Checked Out":
            return {
                backgroundColor: "#f3f4f6",
                color: "#4b5563",
            };

        case "Cancelled":
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

export default function BookingsPage() {
    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-7xl">
                <div>
                    <p
                        className="w-full text-sm font-medium"
                        style={{
                            color: "var(--color-forest-500)",
                        }}>
                        Booking Management
                    </p>
                    <h1
                        className="text-2xl font-semibold"
                        style={{
                            color: "var(--color-forest-900)",
                        }}>
                        Booking Overview
                    </h1>
                </div>
                <div
                    className="mt-8 rounded-xl border bg-white p-4 shadow-sm"
                    style={{
                        borderColor: "var(--color-border)",
                    }}>
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <div className="flex-1">
                            <label
                                htmlFor="booking-search"
                                className="sr-only">
                                Search bookings
                            </label>

                            <input
                                id="booking-search"
                                type="search"
                                placeholder="Search by guest name, booking ID, or room..."
                                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                                style={{
                                    borderColor: "var(--color-border)",
                                }}
                            />
                        </div>
                        <select
                            aria-label="Filter by booking status"
                            defaultValue="all"
                            className="rounded-lg border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                            style={{
                                borderColor: "var(--color-border)",
                            }}>
                            <option value="all">
                                All statuses
                            </option>
                            <option value="pending">
                                Pending
                            </option>
                            <option value="confirmed">
                                Confirmed
                            </option>
                            <option value="checked-in">
                                Checked In
                            </option>
                            <option value="checked-out">
                                Checked Out
                            </option>
                            <option value="cancelled">
                                Cancelled
                            </option>
                        </select>
                        <select
                            aria-label="Filter by booking date"
                            defaultValue="all"
                            className="rounded-lg border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                            style={{
                                borderColor: "var(--color-border)",
                            }}>
                            <option value="all">
                                All dates
                            </option>
                            <option value="upcoming">
                                Upcoming
                            </option>
                            <option value="today">
                                Today
                            </option>
                            <option value="past">
                                Past
                            </option>
                        </select>
                    </div>
                </div>
                <div className="mt-6">
                    <p
                        className="text-sm"
                        style={{
                            color: "var(--color-muted)",
                        }}>
                        {bookings.length} bookings
                    </p>
                </div>
                <div className="mt-3 space-y-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="rounded-xl border bg-white p-6 shadow-sm"
                            style={{
                                borderColor: "var(--color-border)",
                            }}>
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2
                                            className="text-lg font-semibold"
                                            style={{
                                                color:
                                                    "var(--color-forest-900)",
                                            }}>
                                            {booking.guestName}
                                        </h2>

                                        <span
                                            className="rounded-full px-2.5 py-1 text-xs font-medium"
                                            style={getStatusStyles(
                                                booking.status
                                            )}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p
                                        className="mt-1 text-xs"
                                        style={{
                                            color:
                                                "var(--color-muted)",
                                        }}>
                                        {booking.id}
                                    </p>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                        <div>
                                            <p
                                                className="text-xs"
                                                style={{
                                                    color:
                                                        "var(--color-muted)",
                                                }}>
                                                Accommodation
                                            </p>
                                            <p className="mt-1 text-sm font-medium">
                                                {booking.room}
                                            </p>
                                        </div>
                                        <div>
                                            <p
                                                className="text-xs"
                                                style={{
                                                    color:
                                                        "var(--color-muted)",
                                                }}>
                                                Stay
                                            </p>
                                            <p className="mt-1 text-sm font-medium">
                                                {booking.checkIn}
                                            </p>
                                            <p
                                                className="text-xs"
                                                style={{
                                                    color:
                                                        "var(--color-muted)",
                                                }}>
                                                to {booking.checkOut}
                                            </p>
                                        </div>
                                        <div>
                                            <p
                                                className="text-xs"
                                                style={{
                                                    color:
                                                        "var(--color-muted)",
                                                }}>
                                                Guests
                                            </p>
                                            <p className="mt-1 text-sm font-medium">
                                                {booking.guests} guests
                                            </p>
                                        </div>
                                        <div>
                                            <p
                                                className="text-xs"
                                                style={{
                                                    color:
                                                        "var(--color-muted)",
                                                }}>
                                                Total
                                            </p>
                                            <p
                                                className="mt-1 text-sm font-semibold"
                                                style={{
                                                    color:
                                                        "var(--color-forest-700)",
                                                }}>
                                                {booking.total}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <a
                                        className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
                                        style={{
                                            borderColor:
                                                "var(--color-border)",
                                            color:
                                                "var(--color-forest-800)",
                                        }}>
                                        View Booking
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}