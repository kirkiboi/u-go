import Link from "next/link";
type Room = {
    id: string;
    name: string;
    description: string;
    price: string;
    guests: number;
    bedrooms: number;
    bathrooms: number;
    status: string;
};

const rooms: Room[] = [
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
export default async function RoomDetailsPage({

    params,
}: {
    params: Promise<{ roomId: string }>;
}) {
    const { roomId } = await params;
    const room = rooms.find((room) => room.id === roomId);

    if (!room) {
        return (

            <section className="min-h-screen px-8 py-8">
                <div className="mx-auto max-w-5xl">
                    <h1
                        className="text-2xl font-bold"
                        style={{
                            color: "var(--color-forest-900)",
                        }}>
                        Room not found
                    </h1>

                    <p
                        className="mt-2 text-sm"
                        style={{
                            color: "var(--color-muted)",
                        }}>
                        The room you are looking for does not exist.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-5xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p
                            className="text-sm font-medium"
                            style={{
                                color: "var(--color-forest-500)",
                            }}>
                            Room Management
                        </p>

                        <div className="mt-1 flex items-center gap-3">
                            <h1
                                className="text-3xl font-bold"
                                style={{
                                    fontFamily: "var(--font-display)",
                                    color: "var(--color-forest-900)",
                                }}>
                                {room.name}
                            </h1>

                            <span
                                className="rounded-full px-3 py-1 text-xs font-medium"
                                style={{
                                    backgroundColor:
                                        "var(--color-forest-100)",
                                    color:
                                        "var(--color-forest-700)",
                                }}>
                                {room.status}
                            </span>
                        </div>
                    </div>

                    <Link
                        href={`/admin/rooms/${room.id}/edit`}
                        className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
                        style={{
                            backgroundColor: "var(--color-forest-700)",
                        }}>
                        Edit Room
                    </Link>
                </div>
                <div className="mt-8 space-y-6">
                    <div
                        className="rounded-xl border bg-white p-6 shadow-sm"
                        style={{
                            borderColor: "var(--color-border)",
                        }}>
                        <h2
                            className="text-lg font-semibold"
                            style={{
                                color: "var(--color-forest-900)",
                            }}>
                            Room Information
                        </h2>

                        <p
                            className="mt-3 max-w-3xl text-sm leading-relaxed"
                            style={{
                                color: "var(--color-muted)",
                            }}>
                            {room.description}
                        </p>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Price
                                </p>
                                <p className="mt-1 font-semibold">
                                    {room.price}
                                    <span className="ml-1 text-xs font-normal text-gray-500">
                                        / night
                                    </span>
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Guests
                                </p>
                                <p className="mt-1 font-semibold">
                                    {room.guests}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Bedrooms
                                </p>
                                <p className="mt-1 font-semibold">
                                    {room.bedrooms}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Bathrooms
                                </p>
                                <p className="mt-1 font-semibold">
                                    {room.bathrooms}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="rounded-xl border bg-white p-6 shadow-sm"
                        style={{
                            borderColor: "var(--color-border)",
                        }}>
                        <h2
                            className="text-lg font-semibold"
                            style={{
                                color: "var(--color-forest-900)",
                            }}>
                            Room Features
                        </h2>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                "Wi-Fi",
                                "Kitchen",
                                "Private Pool",
                                "Air Conditioning",
                                "Parking",
                                "Mountain View",
                            ].map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm"
                                    style={{
                                        borderColor:
                                            "var(--color-border)",
                                    }}>
                                    <span>{feature}</span>

                                    <span
                                        className="rounded-full px-2 py-1 text-xs font-medium"
                                        style={{
                                            backgroundColor:
                                                "var(--color-forest-100)",
                                            color:
                                                "var(--color-forest-700)",
                                        }}>
                                        Available
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}