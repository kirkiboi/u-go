import Link from "next/link";
import { getRooms } from "@/services/room";
const ROOMS_PER_PAGE = 4;

export default async function RoomsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const requestedPage = Number(params.page) || 1;

    const {
        rooms,
        totalRooms,
        totalPages,
        currentPage,
    } = await getRooms(requestedPage, ROOMS_PER_PAGE);

    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-7xl">
                {totalRooms === 0 ? (
                    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
                        <p
                            className="text-sm font-medium"
                            style={{
                                color: "var(--color-forest-500)",
                            }}>
                            Room Management
                        </p>

                        <h1
                            className="mt-1 text-3xl font-bold"
                            style={{
                                fontFamily: "var(--font-display)",
                                color: "var(--color-forest-900)",
                            }}>
                            Rooms Overview
                        </h1>

                        <p
                            className="mt-4 max-w-md text-sm leading-relaxed"
                            style={{
                                color: "var(--color-muted)",
                            }}>
                            You don&apos;t have any rooms yet. Let&apos;s add your first
                            one and get your resort ready for bookings.
                        </p>

                        <Link
                            href="/admin/rooms/add"
                            className="mt-6 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 cursor-pointer"
                            style={{
                                backgroundColor: "var(--color-forest-700)",
                            }}>
                            Add Room Here
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-wrap items-end justify-between">
                            <div>
                                <p
                                    className="text-sm font-medium"
                                    style={{
                                        color: "var(--color-forest-500)",
                                    }}>
                                    Room Management
                                </p>

                                <h1
                                    className="mt-1 text-3xl font-bold"
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        color: "var(--color-forest-900)",
                                    }}>
                                    Rooms Overview
                                </h1>
                            </div>

                            <Link
                                href="/admin/rooms/add"
                                className="ml-auto shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 cursor-pointer"
                                style={{
                                    backgroundColor:
                                        "var(--color-forest-700)",
                                }}>
                                + Add Room
                            </Link>
                        </div>

                        <div className="mt-8 space-y-4">
                            {rooms.map((room) => (
                                <div
                                    key={room.id}
                                    className="rounded-xl border bg-white p-6 shadow-sm"
                                    style={{
                                        borderColor: "var(--color-border)",
                                    }}>
                                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="min-w-0">
                                            <p
                                                className="mt-2 max-w-2xl text-sm leading-relaxed"
                                                style={{
                                                    color: "var(--color-muted)",
                                                }}>
                                                {room.name}
                                            </p>

                                            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                                <span>
                                                    <strong>
                                                        {room.maxGuests}
                                                    </strong>{" "}
                                                    max guests
                                                </span>

                                                <span>
                                                    <strong>
                                                        {room.checkInTime}
                                                    </strong>{" "}
                                                    Check In
                                                </span>

                                                <span>
                                                    <strong>
                                                        {room.checkOutTime}
                                                    </strong>{" "}
                                                    Check Out
                                                </span>

                                                <span>
                                                    <strong>
                                                        ₱{room.price.toLocaleString("en-PH")}
                                                    </strong>
                                                    /night
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 gap-2">
                                            <Link
                                                href={`/admin/rooms/${room.id}`}
                                                className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
                                                style={{
                                                    backgroundColor:
                                                        "var(--color-forest-100)",
                                                    color:
                                                        "var(--color-forest-800)",
                                                }}>
                                                View Room
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex items-center justify-between gap-4">
                            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                                Showing{" "}{totalRooms === 0 ? 0 : (currentPage - 1) * ROOMS_PER_PAGE + 1}{"–"}{Math.min(currentPage * ROOMS_PER_PAGE, totalRooms)} of {totalRooms} rooms
                            </p>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/admin/rooms?page=${currentPage - 1}`}
                                    aria-disabled={currentPage <= 1}
                                    className={`rounded-lg border px-3 py-2 text-sm ${currentPage <= 1 ? "pointer-events-none opacity-40" : "hover:bg-gray-50"}`}
                                    style={{ borderColor: "var(--color-border)" }}>
                                    Previous
                                </Link>

                                <span className="text-sm" style={{ color: "var(--color-muted)" }}>
                                    Page {currentPage} of {Math.max(1, totalPages)}
                                </span>

                                <Link
                                    href={`/admin/rooms?page=${currentPage + 1}`}
                                    aria-disabled={currentPage >= totalPages}
                                    className={`rounded-lg border px-3 py-2 text-sm ${currentPage >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-gray-50"}`}
                                    style={{ borderColor: "var(--color-border)" }}>
                                    Next
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}