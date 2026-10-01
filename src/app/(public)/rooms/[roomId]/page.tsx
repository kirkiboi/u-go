import Link from "next/link";

const rooms = {
    "room-1": {
        name: "Cabin House",
        description:
            "A cozy mountain escape surrounded by trees and peaceful scenery, perfect for guests looking to relax and enjoy the outdoors.",
        price: "₱2,999",
        guests: 3,
        bedrooms: 1,
        beds: 2,
        bathrooms: 1,
        swimmingPools: 0,
        amenities: [
            "Wi-Fi",
            "Air Conditioning",
            "Private Parking",
            "Mountain View",
            "Outdoor Seating",
        ],
    },

    "room-2": {
        name: "Pinetree House",
        description:
            "A relaxing mountain retreat with comfortable spaces for families and small groups.",
        price: "₱4,500",
        guests: 6,
        bedrooms: 2,
        beds: 3,
        bathrooms: 1,
        swimmingPools: 1,
        amenities: [
            "Wi-Fi",
            "Private Kitchen",
            "Swimming Pool",
            "Air Conditioning",
            "Private Parking",
            "Mountain View",
        ],
    },

    "room-3": {
        name: "Mountain View Cottage",
        description:
            "A spacious cottage designed for larger groups, offering beautiful mountain views and a private pool.",
        price: "₱8,999",
        guests: 15,
        bedrooms: 4,
        beds: 8,
        bathrooms: 2,
        swimmingPools: 1,
        amenities: [
            "Wi-Fi",
            "Private Pool",
            "Kitchen",
            "Air Conditioning",
            "Private Parking",
            "Mountain View",
            "Outdoor Dining Area",
        ],
    },
};

type RoomId = keyof typeof rooms;
type RoomPageProps = {
    params: Promise<{
        roomId: string;
    }>;
};

export default async function RoomPage({ params }: RoomPageProps) {
    const { roomId } = await params;
    const room = rooms[roomId as RoomId];
    if (!room) {
        return (
            <main className="min-h-screen px-6 py-24">
                <div className="mx-auto max-w-4xl text-center">
                    <h1
                        className="text-3xl font-semibold"
                        style={{
                            color: "var(--color-forest-900)",
                        }}>
                        Room not found
                    </h1>

                    <p
                        className="mt-3"
                        style={{
                            color: "var(--color-muted)",
                        }}>
                        The accommodation you are looking for does not exist.
                    </p>

                    <Link
                        href="/rooms"
                        className="mt-6 inline-flex rounded-lg px-5 py-3 text-sm font-semibold text-white"
                        style={{
                            backgroundColor: "var(--color-forest-700)",
                        }}>
                        Back to Rooms
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen">
            <section className="px-6 pb-12 pt-32">
                <div className="mx-auto max-w-7xl">
                    <Link
                        href="/rooms"
                        className="text-sm font-medium transition-opacity hover:opacity-70"
                        style={{
                            color: "var(--color-forest-700)",
                        }}
                    >
                        ← Back to Rooms
                    </Link>

                    <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div
                            className="aspect-[4/3] rounded-2xl"
                            style={{
                                backgroundColor:
                                    "var(--color-forest-100)",
                            }}>
                            <div className="flex h-full items-center justify-center">
                                <span
                                    className="text-sm"
                                    style={{
                                        color: "var(--color-forest-600)",
                                    }}>
                                    Room photo placeholder
                                </span>
                            </div>
                        </div>
                        <div>
                            <p
                                className="text-sm font-semibold uppercase tracking-[0.18em]"
                                style={{
                                    color: "var(--color-forest-500)",
                                }}>
                                U-GO Mountain Resort
                            </p>

                            <h1
                                className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
                                style={{
                                    fontFamily: "var(--font-display)",
                                    color: "var(--color-forest-900)",
                                }}>
                                {room.name}
                            </h1>
                            <p
                                className="mt-5 max-w-xl leading-relaxed"
                                style={{
                                    color: "var(--color-muted)",
                                }}>
                                {room.description}
                            </p>
                            <div className="mt-7">
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
            <section
                className="px-6 py-16"
                style={{
                    backgroundColor: "var(--color-forest-50)",
                }}>
                <div className="mx-auto max-w-7xl">

                    <div className="max-w-2xl">
                        <h2
                            className="text-3xl font-semibold"
                            style={{
                                color: "var(--color-forest-900)",
                            }}>
                            Room Details
                        </h2>
                        <p
                            className="mt-3"
                            style={{
                                color: "var(--color-muted)",
                            }}>
                            Everything you need to know before staying at{" "}
                            {room.name}.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        <DetailCard
                            label="Guests"
                            value={`${room.guests} guests`}
                        />

                        <DetailCard
                            label="Bedrooms"
                            value={`${room.bedrooms} bedroom${room.bedrooms !== 1 ? "s" : ""}`}
                        />

                        <DetailCard
                            label="Beds"
                            value={`${room.beds} beds`}
                        />

                        <DetailCard
                            label="Bathrooms"
                            value={`${room.bathrooms} bathroom${room.bathrooms !== 1 ? "s" : ""}`}
                        />

                        <DetailCard
                            label="Swimming Pools"
                            value={
                                room.swimmingPools === 0
                                    ? "No private pool"
                                    : `${room.swimmingPools} pool`
                            }
                        />
                    </div>
                </div>
            </section>
            <section className="px-6 py-16">
                <div className="mx-auto max-w-7xl">

                    <h2
                        className="text-3xl font-semibold"
                        style={{
                            color: "var(--color-forest-900)",
                        }}>
                        What's Included
                    </h2>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {room.amenities.map((amenity) => (
                            <div
                                key={amenity}
                                className="rounded-xl border bg-white px-5 py-4"
                                style={{
                                    borderColor:
                                        "var(--color-border)",
                                }}>
                                <span className="text-sm font-medium">
                                    {amenity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section
                className="px-6 py-20 text-center"
                style={{
                    backgroundColor: "var(--color-forest-800)",
                }}>
                <h2
                    className="text-3xl font-semibold text-white"
                    style={{
                        fontFamily: "var(--font-display)",
                    }}>
                    Ready for your mountain escape?
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70">
                    Book your stay at {room.name} and enjoy a peaceful
                    retreat surrounded by nature.
                </p>

                <Link
                    href="/booking"
                    className="mt-7 inline-flex rounded-lg px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:brightness-110"
                    style={{
                        backgroundColor: "var(--color-forest-200)",
                        color: "var(--color-forest-900)",
                    }}>
                    Book With Us
                </Link>
            </section>
        </main>
    );
}

function DetailCard({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div
            className="rounded-xl border bg-white p-5"
            style={{
                borderColor: "var(--color-border)",
            }}>
            <p
                className="text-sm"
                style={{
                    color: "var(--color-muted)",
                }}>
                {label}
            </p>
            <p
                className="mt-2 text-lg font-semibold"
                style={{
                    color: "var(--color-forest-900)",
                }}>
                {value}
            </p>
        </div>
    );
}