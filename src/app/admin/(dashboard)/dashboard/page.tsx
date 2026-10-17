import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RoomAvailabilityModal from "@/components/admin/roomAvailabilityModal";
import ActiveBookingsModal from "@/components/admin/activeBookingsModal";

function getManilaDateParts(date: Date) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);

    return Object.fromEntries(
        parts.map((part) => [part.type, part.value])
    );
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-PH", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    }).format(date);
}

export default async function AdminDashboard() {
    const now = new Date();
    const dateParts = getManilaDateParts(now);
    const year = Number(dateParts.year);
    const month = Number(dateParts.month);
    const todayKey =
        `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
    const today = new Date(`${todayKey}T00:00:00.000Z`);
    const monthStart = new Date(
        Date.UTC(year, month - 1, 1) - 8 * 60 * 60 * 1000
    );
    const nextMonthStart = new Date(
        Date.UTC(year, month, 1) - 8 * 60 * 60 * 1000
    );
    const [
        rooms,
        activeBookingRecords,
        recentBookings,
        paidBookingValue,
        availabilityBookings,
    ] = await Promise.all([
        prisma.room.findMany({
            orderBy: { id: "asc" },
            select: { id: true, name: true },
        }),
        prisma.booking.findMany({
            where: {
                status: "CONFIRMED",
                check_out: { gte: today },
            },
            orderBy: { check_in: "asc" },
            include: {
                room: {
                    select: { name: true },
                },
            },
        }),
        prisma.booking.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                room: {
                    select: { name: true },
                },
            },
        }),
        prisma.booking.aggregate({
            where: {
                payment_status: "PAID",
                createdAt: {
                    gte: monthStart,
                    lt: nextMonthStart,
                },
            },
            _sum: { total: true },
        }),
        prisma.booking.findMany({
            where: {
                check_out: { gte: today },
                OR: [
                    { status: "CONFIRMED" },
                    {
                        status: "PENDING",
                        payment_status: "PENDING",
                        payment_expires_at: { gt: now },
                    },
                ],
            },
            select: {
                id: true,
                room_id: true,
                check_in: true,
                check_out: true,
                status: true,
                payment_status: true,
            },
        }),
    ]);
    const activeBookings = activeBookingRecords.length;
    const activeBookingsForModal = activeBookingRecords.map((booking) => ({
        id: booking.id,
        booking_ref: booking.booking_ref,
        guest_fname: booking.guest_fname,
        guest_lname: booking.guest_lname,
        guest_email: booking.guest_email,
        guest_phone: booking.guest_phone,
        check_in: booking.check_in.toISOString().slice(0, 10),
        check_out: booking.check_out.toISOString().slice(0, 10),
        total: booking.total,
        payment_status: booking.payment_status,
        room: booking.room,
    }));
    const calendarBookings = availabilityBookings.map((booking) => ({
        id: booking.id,
        roomId: booking.room_id,
        checkIn: booking.check_in.toISOString().slice(0, 10),
        checkOut: booking.check_out.toISOString().slice(0, 10),
        status: booking.status as "CONFIRMED" | "PENDING",
        paymentStatus: booking.payment_status as "PAID" | "PENDING",
    }));
    const revenue = paidBookingValue._sum.total ?? 0;

    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-7xl">
                <div>
                    <p
                        className="text-sm font-medium"
                        style={{
                            color: "var(--color-forest-500)",
                        }}>
                        Admin Dashboard
                    </p>
                    <h1
                        className="mt-1 text-3xl font-bold"
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "var(--color-forest-900)",
                        }}>
                        Overview
                    </h1>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                        className="rounded-xl border bg-white p-6 shadow-sm"
                        style={{ borderColor: "var(--color-border)" }}>
                        <p
                            className="text-sm font-medium"
                            style={{ color: "var(--color-muted)" }}>
                            Paid Booking Value (Created This Month)
                        </p>
                        <p
                            className="mt-2 text-3xl font-bold"
                            style={{ color: "var(--color-forest-900)" }}>
                            ₱{revenue.toLocaleString("en-PH")}
                        </p>
                        <p
                            className="mt-2 text-xs"
                            style={{ color: "var(--color-muted)" }}>
                            Total value of paid bookings created this month
                        </p>
                    </div>
                    <ActiveBookingsModal bookings={activeBookingsForModal} />
                    <div>
                        <RoomAvailabilityModal
                            rooms={rooms}
                            bookings={calendarBookings}
                        />
                    </div>
                </div>
                <div className="mt-8 grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 rounded-xl border bg-white shadow-sm" style={{ borderColor: "var(--color-border)" }}>
                        <div className="border-b px-6 py-4" style={{ borderColor: "var(--color-border)" }}>
                            <h2 className="text-lg font-semibold" style={{ color: "var(--color-forest-900)" }}>Recent Bookings</h2>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-gray-50 text-xs uppercase" style={{ color: "var(--color-muted)" }}>
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Guest</th>
                                        <th className="px-6 py-3 font-medium">Room</th>
                                        <th className="px-6 py-3 font-medium">Dates</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody
                                    className="divide-y"
                                    style={{ borderColor: "var(--color-border)" }}
                                >
                                    {recentBookings.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-10 text-center"
                                                style={{ color: "var(--color-muted)" }}
                                            >
                                                No bookings have been created yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentBookings.map((booking) => {
                                            const statusStyles: Record<string, string> = {
                                                PENDING: "bg-amber-100 text-amber-800",
                                                CONFIRMED:
                                                    "bg-[var(--color-forest-100)] text-[var(--color-forest-700)]",
                                                CANCELLED: "bg-red-100 text-red-800",
                                                COMPLETED: "bg-gray-100 text-gray-700",
                                            };

                                            return (
                                                <tr
                                                    key={booking.id}
                                                    className="transition-colors hover:bg-gray-50">
                                                    <td
                                                        className="px-6 py-4 font-medium"
                                                        style={{ color: "var(--color-forest-900)" }}>
                                                        {booking.guest_fname} {booking.guest_lname}
                                                    </td>
                                                    <td
                                                        className="px-6 py-4"
                                                        style={{ color: "var(--color-muted)" }}>
                                                        {booking.room.name}
                                                    </td>
                                                    <td
                                                        className="px-6 py-4"
                                                        style={{ color: "var(--color-muted)" }}>
                                                        {formatDate(booking.check_in)} –{" "}
                                                        {formatDate(booking.check_out)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[booking.status] ??
                                                                "bg-gray-100 text-gray-700"
                                                                }`}>
                                                            {booking.status.charAt(0) +
                                                                booking.status.slice(1).toLowerCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-t px-6 py-4" style={{ borderColor: "var(--color-border)" }}>
                            <Link href="/admin/bookings" className="text-sm font-medium hover:underline transition-all" style={{ color: "var(--color-forest-700)" }}>View all bookings &rarr;</Link>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="rounded-xl border bg-white shadow-sm" style={{ borderColor: "var(--color-border)" }}>
                            <div className="border-b px-6 py-4" style={{ borderColor: "var(--color-border)" }}>
                                <h2 className="text-lg font-semibold" style={{ color: "var(--color-forest-900)" }}>Quick Actions</h2>
                            </div>
                            <div className="p-4 space-y-3">
                                <Link href="/admin/rooms/add" className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50" style={{ borderColor: "var(--color-border)" }}>
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--color-forest-100)", color: "var(--color-forest-700)" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: "var(--color-forest-900)" }}>Add New Room</p>
                                        <p className="text-xs" style={{ color: "var(--color-muted)" }}>Create a new accommodation</p>
                                    </div>
                                </Link>
                                <Link href="/admin/amenities/add" className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50" style={{ borderColor: "var(--color-border)" }}>
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--color-forest-100)", color: "var(--color-forest-700)" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: "var(--color-forest-900)" }}>Add Amenity</p>
                                        <p className="text-xs" style={{ color: "var(--color-muted)" }}>Register a new resort facility</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}