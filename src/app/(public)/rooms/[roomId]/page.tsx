import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoomById } from "@/services/room";

interface RoomPageProps {
    params: Promise<{
        roomId: string;
    }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
    const { roomId } = await params;
    const id = Number(roomId);
    if (!Number.isInteger(id)) {
        notFound();
    }
    const room = await getRoomById(id);
    if (!room) {
        notFound();
    }

    return (
        <main className="min-h-screen">
            <section className="px-6 pb-2 pt-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                            <img
                                src={room.image}
                                alt={room.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div>
                            <h3
                                className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
                                style={{
                                    fontFamily: "var(--font-display)",
                                    color: "var(--color-forest-900)",
                                }}>
                                {room.name}
                            </h3>
                            <p
                                className="mt-5 max-w-xl leading-relaxed"
                                style={{
                                    color: "var(--color-muted)",
                                }}>
                                {room.description}
                            </p>
                            <div className="mt-7">
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    <RoomInfo
                                        icon={
                                            <svg
                                                className="h-5 w-5"
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
                                        }
                                        label="Guests"
                                        value={`${room.maxGuests}`}
                                    />
                                    <RoomInfo
                                        icon={
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a9 9 0 001 1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                                />
                                            </svg>
                                        }
                                        label="Bedrooms"
                                        value={!room.bedrooms ? "None" : `${room.bedrooms}`}
                                    />
                                    <RoomInfo
                                        icon={
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 7h16M4 12h16M4 17h16"
                                                />
                                            </svg>
                                        }
                                        label="Beds"
                                        value={!room.beds ? "None" : `${room.beds}`}
                                    />
                                    <RoomInfo
                                        icon={
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 21v-7a4 4 0 014-4h8a4 4 0 014 4v7M7 10V7a5 5 0 0110 0v3"
                                                />
                                            </svg>
                                        }
                                        label="Bathrooms"
                                        value={!room.bathrooms ? "None" : `${room.bathrooms}`}
                                    />
                                    <RoomInfo
                                        icon={
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 6h16M4 12h16M4 18h16"
                                                />
                                            </svg>
                                        }
                                        label="Bed Type"
                                        value={room.bedType ?? "Not specified"}
                                    />
                                    <RoomInfo
                                        icon={
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 6v6l4 2"
                                                />
                                            </svg>
                                        }
                                        label="Check-in"
                                        value={room.checkInTime}
                                    />
                                    <RoomInfo
                                        icon={
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 6v6l4 2"
                                                />
                                            </svg>
                                        }
                                        label="Check-out"
                                        value={room.checkOutTime}
                                    />
                                    <RoomInfo
                                        icon={
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 3v18M3 12h18"
                                                />
                                            </svg>
                                        }
                                        label="Pool"
                                        value={room.hasPrivatePool ? "Available" : "None"}
                                    />
                                </div>
                                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {room.hasWifi && (
                                        <IncludedItem label="Wi-Fi" />
                                    )}

                                    {room.hasParking && (
                                        <IncludedItem label="Parking" />
                                    )}

                                    {room.hasAC && (
                                        <IncludedItem label="Air Conditioning" />
                                    )}

                                    {room.hasKitchen && (
                                        <IncludedItem label="Kitchen" />
                                    )}

                                    {room.hasPrivatePool && (
                                        <IncludedItem label="Private Pool" />
                                    )}
                                </div>
                                <br />
                                <span
                                    className="text-2xl font-semibold"
                                    style={{
                                        color: "var(--color-forest-700)",
                                    }}>
                                    {room.price}
                                </span>
                                <span
                                    className="ml-2 text-sm"
                                    style={{
                                        color: "var(--color-muted)",
                                    }}>
                                    / night
                                </span>
                            </div>
                            <Link
                                href="/rooms"
                                className="mt-7 mr-6 inline-flex rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
                                style={{
                                    color: "var(--color-forest-700)",
                                    backgroundColor:
                                        "var(--color-forest-200)"
                                }}>
                                ← Back to Rooms
                            </Link>
                            <Link
                                href="/booking"
                                className="mt-7 inline-flex rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
                                style={{
                                    backgroundColor:
                                        "var(--color-forest-700)",
                                }}>
                                Book This Cottage
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function RoomInfo({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{
                    backgroundColor: "var(--color-forest-100)",
                    color: "var(--color-forest-700)",
                }}>
                {icon}
            </div>
            <div className="min-w-0">
                <p
                    className="text-xs uppercase tracking-wider"
                    style={{
                        color: "var(--color-muted)",
                    }}>
                    {label}
                </p>
                <p
                    className="mt-1 text-sm font-semibold"
                    style={{
                        color: "var(--color-forest-900)",
                    }}>
                    {value}
                </p>
            </div>
        </div>
    );
}

function IncludedItem({ label }: { label: string }) {
    return (
        <div
            className="rounded-xl border bg-white px-5 py-4"
            style={{
                borderColor: "var(--color-border)",
            }}>
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
}