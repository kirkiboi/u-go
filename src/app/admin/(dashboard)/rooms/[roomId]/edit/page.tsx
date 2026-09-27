type Room = {
    id: string;
    name: string;
    description: string;
    price: string;
    guests: number;
    bedrooms: number;
    bathrooms: number;
};

const rooms: Room[] = [
    {
        id: "room-1",
        name: "Cabin House",
        description:
            "A cozy mountain escape for up to 3 guests, surrounded by trees and peaceful scenery.",
        price: "2999",
        guests: 3,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        id: "room-2",
        name: "Pinetree House",
        description:
            "A relaxing mountain retreat for up to 6 guests with a private kitchen and peaceful surroundings.",
        price: "4500",
        guests: 6,
        bedrooms: 2,
        bathrooms: 1,
    },
    {
        id: "room-3",
        name: "Mountain View Cottage",
        description:
            "A spacious cottage for groups of up to 15 guests with beautiful mountain views and a private pool.",
        price: "8999",
        guests: 15,
        bedrooms: 4,
        bathrooms: 2,
    },
];

export default async function EditRoomPage({
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
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
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
                        Edit Room {room.name}
                    </h1>
                </div>

                <form
                    className="rounded-xl border bg-white p-6 shadow-sm"
                    style={{
                        borderColor: "var(--color-border)",
                    }}>
                    <div className="space-y-6">
                        <div>
                            <h2
                                className="text-lg font-semibold"
                                style={{
                                    color: "var(--color-forest-900)",
                                }}>
                                Basic Information
                            </h2>

                            <div className="mt-4 grid gap-5 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="room-name"
                                        className="block text-sm font-medium">
                                        Room name
                                    </label>

                                    <input
                                        id="room-name"
                                        type="text"
                                        defaultValue={room.name}
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
                                        style={{
                                            borderColor:
                                                "var(--color-border)",
                                        }}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="room-price"
                                        className="block text-sm font-medium">
                                        Price per night
                                    </label>

                                    <input
                                        id="room-price"
                                        type="number"
                                        defaultValue={room.price}
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
                                        style={{
                                            borderColor:
                                                "var(--color-border)",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="room-description"
                                className="block text-sm font-medium">
                                Description
                            </label>

                            <textarea
                                id="room-description"
                                rows={4}
                                defaultValue={room.description}
                                className="mt-2 w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
                                style={{
                                    borderColor:
                                        "var(--color-border)",
                                }}
                            />
                        </div>

                        <div>
                            <h2
                                className="text-lg font-semibold"
                                style={{
                                    color: "var(--color-forest-900)",
                                }}>
                                Capacity & Layout
                            </h2>

                            <div className="mt-4 grid gap-5 sm:grid-cols-3">
                                <div>
                                    <label
                                        htmlFor="room-guests"
                                        className="block text-sm font-medium">
                                        Maximum guests
                                    </label>

                                    <input
                                        id="room-guests"
                                        type="number"
                                        min="1"
                                        defaultValue={room.guests}
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
                                        style={{
                                            borderColor:
                                                "var(--color-border)",
                                        }}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="room-bedrooms"
                                        className="block text-sm font-medium">
                                        Bedrooms
                                    </label>

                                    <input
                                        id="room-bedrooms"
                                        type="number"
                                        min="0"
                                        defaultValue={room.bedrooms}
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
                                        style={{
                                            borderColor:
                                                "var(--color-border)",
                                        }}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="room-bathrooms"
                                        className="block text-sm font-medium">
                                        Bathrooms
                                    </label>

                                    <input
                                        id="room-bathrooms"
                                        type="number"
                                        min="0"
                                        defaultValue={room.bathrooms}
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
                                        style={{
                                            borderColor:
                                                "var(--color-border)",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
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
                                    <label
                                        key={feature}
                                        className="flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm"
                                        style={{
                                            borderColor:
                                                "var(--color-border)",
                                        }}>
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="h-4 w-4"
                                            style={{
                                                accentColor:
                                                    "var(--color-forest-600)",
                                            }}
                                        />
                                        {feature}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div
                            className="flex justify-end gap-3 border-t pt-6"
                            style={{
                                borderColor: "var(--color-border)",
                            }}>
                            <button
                                type="button"
                                className="rounded-lg border px-4 py-2.5 text-sm font-medium"
                                style={{
                                    borderColor:
                                        "var(--color-border)",
                                    color:
                                        "var(--color-forest-800)",
                                }}>
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                                style={{
                                    backgroundColor:
                                        "var(--color-forest-700)",
                                }}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}