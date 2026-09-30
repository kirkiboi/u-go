import Link from "next/link";

export default function AdminDashboard() {
    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-7xl">
                <div>
                    <p
                        className="w-full text-sm font-medium"
                        style={{
                            color: "var(--color-forest-500)",
                        }}>
                        Admin Dashboard
                    </p>
                    <h1
                        className="text-2xl font-semibold"
                        style={{
                            color: "var(--color-forest-900)",
                        }}>
                        Overview
                    </h1>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-white p-6 shadow-sm" style={{ borderColor: "var(--color-border)" }}>
                        <p className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>Total Revenue (This Month)</p>
                        <p className="mt-2 text-3xl font-bold" style={{ color: "var(--color-forest-900)" }}>₱145,980</p>
                        <p className="mt-2 text-xs text-green-600 font-medium">+12.5% from last month</p>
                    </div>
                    <div className="rounded-xl border bg-white p-6 shadow-sm" style={{ borderColor: "var(--color-border)" }}>
                        <p className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>Active Bookings</p>
                        <p className="mt-2 text-3xl font-bold" style={{ color: "var(--color-forest-900)" }}>24</p>
                        <p className="mt-2 text-xs text-green-600 font-medium">+3 new today</p>
                    </div>
                    <div className="rounded-xl border bg-white p-6 shadow-sm" style={{ borderColor: "var(--color-border)" }}>
                        <p className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>Available Rooms</p>
                        <p className="mt-2 text-3xl font-bold" style={{ color: "var(--color-forest-900)" }}>8</p>
                        <p className="mt-2 text-xs" style={{ color: "var(--color-muted)" }}>Out of 12 total rooms</p>
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
                                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium" style={{ color: "var(--color-forest-900)" }}>Juan Dela Cruz</td>
                                        <td className="px-6 py-4" style={{ color: "var(--color-muted)" }}>Cabin House</td>
                                        <td className="px-6 py-4" style={{ color: "var(--color-muted)" }}>Sep 28 - Sep 30</td>
                                        <td className="px-6 py-4">
                                            <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: "var(--color-forest-100)", color: "var(--color-forest-700)" }}>Confirmed</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium" style={{ color: "var(--color-forest-900)" }}>Maria Santos</td>
                                        <td className="px-6 py-4" style={{ color: "var(--color-muted)" }}>Mountain View Cottage</td>
                                        <td className="px-6 py-4" style={{ color: "var(--color-muted)" }}>Oct 4 - Oct 6</td>
                                        <td className="px-6 py-4">
                                            <span className="rounded-full px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-800">Pending</span>
                                        </td>
                                    </tr>
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
                                <Link href="/admin/rooms/add-rooms" className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50" style={{ borderColor: "var(--color-border)" }}>
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
                        <div className="rounded-xl border bg-white shadow-sm" style={{ borderColor: "var(--color-border)" }}>
                            <div className="border-b px-6 py-4" style={{ borderColor: "var(--color-border)" }}>
                                <h2 className="text-lg font-semibold" style={{ color: "var(--color-forest-900)" }}>Today's Tasks</h2>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer" />
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: "var(--color-forest-900)" }}>Review Pending Bookings</p>
                                        <p className="text-xs" style={{ color: "var(--color-muted)" }}>3 bookings awaiting confirmation</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer" />
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: "var(--color-forest-900)" }}>Update Room Availability</p>
                                        <p className="text-xs" style={{ color: "var(--color-muted)" }}>Check for maintenance schedules</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer" />
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: "var(--color-forest-900)" }}>Respond to Guest Inquiries</p>
                                        <p className="text-xs" style={{ color: "var(--color-muted)" }}>5 new messages from potential guests</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}