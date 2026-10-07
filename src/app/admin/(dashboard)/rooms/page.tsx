import Link from "next/link";
import { getRooms } from "@/services/room";
export default async function RoomsPage() {
    const rooms = await getRooms();
    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-7xl">
                {rooms.length === 0 ? (
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
                                                    guests
                                                </span>

                                                <span>
                                                    <strong>
                                                        {room.bedrooms}
                                                    </strong>{" "}
                                                    bedrooms
                                                </span>

                                                <span>
                                                    <strong>
                                                        {room.bathrooms}
                                                    </strong>{" "}
                                                    bathrooms
                                                </span>

                                                <span
                                                    className="font-semibold"
                                                    style={{
                                                        color: "var(--color-forest-700)",
                                                    }}>
                                                    {room.price} / night
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
                    </>
                )}
            </div>
        </section>
    );
}