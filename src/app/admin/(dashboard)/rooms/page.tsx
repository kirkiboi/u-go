"use client";
import { useRouter } from "next/navigation";
const rooms = [
    {
        id: "room-1",
        name: "Cabin House",
        description:
            "A cozy mountain escape for up to 3 guests, surrounded by trees and peaceful scenery.",
        price: "₱2,999",
        guests: 3,
        bedrooms: 1,
        bathrooms: 1,
        status: "Available",
    },
    {
        id: "room-2",
        name: "Pinetree House",
        description:
            "A relaxing mountain retreat for up to 6 guests with a private kitchen and peaceful surroundings.",
        price: "₱4,500",
        guests: 6,
        bedrooms: 2,
        bathrooms: 1,
        status: "Available",
    },
    {
        id: "room-3",
        name: "Mountain View Cottage",
        description:
            "A spacious cottage for groups of up to 15 guests with beautiful mountain views and a private pool.",
        price: "₱8,999",
        guests: 15,
        bedrooms: 4,
        bathrooms: 2,
        status: "Available",
    },
];

export default function RoomsPage() {
    const router = useRouter();
    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-wrap items-end justify-between">
                    <p
                        className="w-full text-sm font-medium"
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
                    <button
                        type="button"
                        onClick={() => router.push("/admin/rooms/add")}
                        className="ml-auto shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold 
                        text-white transition-all duration-200 hover:-translate-y-0.5 
                        hover:brightness-110 cursor-pointer"
                        style={{
                            backgroundColor: "var(--color-forest-700)",
                        }}>
                        + Add Room
                    </button>
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
                                    <div className="flex items-center gap-3">
                                        <h2
                                            className="text-xl font-semibold"
                                            style={{
                                                color: "var(--color-forest-900)",
                                            }}>
                                            {room.name}
                                        </h2>
                                        <span
                                            className="rounded-full px-2.5 py-1 text-xs font-medium"
                                            style={{
                                                backgroundColor:
                                                    "var(--color-forest-100)",
                                                color:
                                                    "var(--color-forest-700)",
                                            }}>
                                            {room.status}
                                        </span>
                                    </div>

                                    <p
                                        className="mt-2 max-w-2xl text-sm leading-relaxed"
                                        style={{
                                            color: "var(--color-muted)",
                                        }}>
                                        {room.description}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                        <span>
                                            <strong>{room.guests}</strong>{" "}
                                            guests
                                        </span>

                                        <span>
                                            <strong>{room.bedrooms}</strong>{" "}
                                            bedrooms
                                        </span>

                                        <span>
                                            <strong>{room.bathrooms}</strong>{" "}
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
                                    <button
                                        type="button"
                                        className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
                                        style={{
                                            borderColor:
                                                "var(--color-border)",
                                            color:
                                                "var(--color-forest-800)",
                                        }}>
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
                                        style={{
                                            backgroundColor:
                                                "var(--color-forest-100)",
                                            color:
                                                "var(--color-forest-800)",
                                        }}>
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}