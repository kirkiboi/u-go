import { getRoomById } from "@/services/room";
import { editRoom } from "./actions";
import CancelEditButton from "@/components/admin/editRoomButtonCancel";
import SaveEditRoomButton from "@/components/admin/saveEditRoomButton";

function toTimeInputValue(time: string) {
    const normalized = time.trim().toUpperCase();

    const match = normalized.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|NN)$/);

    if (!match) {
        return "";
    }

    let hour = Number(match[1]);
    const minute = match[2];
    const period = match[3];

    if (period === "PM" && hour !== 12) {
        hour += 12;
    }

    if ((period === "AM" || period === "NN") && hour === 12) {
        hour = 0;
    }

    return `${String(hour).padStart(2, "0")}:${minute}`;
}

export default async function EditRoomPage({
    params,
}: {
    params: Promise<{ roomId: string }>;
}) {
    const { roomId } = await params;
    const id = Number(roomId);

    if (!Number.isInteger(id)) {
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

    const room = await getRoomById(id);

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
                        Edit {room.name}
                    </h1>
                </div>

                <form
                    id="edit-room-form"
                    action={editRoom.bind(null, id)}
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
                                        name="name"
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
                                        name="price"
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
                                name="description"
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

                            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <label
                                        htmlFor="room-guests"
                                        className="block text-sm font-medium">
                                        Maximum guests
                                    </label>

                                    <input
                                        id="room-guests"
                                        name="maxGuests"
                                        type="number"
                                        min="1"
                                        defaultValue={room.maxGuests}
                                        required
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
                                        style={{
                                            borderColor: "var(--color-border)",
                                        }}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="room-beds"
                                        className="block text-sm font-medium">
                                        Beds
                                    </label>

                                    <input
                                        id="room-beds"
                                        name="beds"
                                        type="number"
                                        min="1"
                                        defaultValue={room.beds}
                                        required
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
                                        style={{
                                            borderColor: "var(--color-border)",
                                        }}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="room-bed-type"
                                        className="block text-sm font-medium">
                                        Bed type
                                    </label>

                                    <input
                                        id="room-bed-type"
                                        name="bedType"
                                        type="text"
                                        defaultValue={room.bedType ?? ""}
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
                                        style={{
                                            borderColor: "var(--color-border)",
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
                                        name="bedrooms"
                                        type="number"
                                        min="0"
                                        defaultValue={room.bedrooms ?? ""}
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
                                        style={{
                                            borderColor: "var(--color-border)",
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
                                        name="bathrooms"
                                        type="number"
                                        min="0"
                                        required
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
                                        style={{
                                            borderColor: "var(--color-border)",
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
                                    {
                                        id: "hasWifi",
                                        label: "Wi-Fi",
                                        checked: room.hasWifi,
                                    },
                                    {
                                        id: "hasKitchen",
                                        label: "Kitchen",
                                        checked: room.hasKitchen,
                                    },
                                    {
                                        id: "hasPrivatePool",
                                        label: "Private Pool",
                                        checked: room.hasPrivatePool,
                                    },
                                    {
                                        id: "hasAC",
                                        label: "Air Conditioning",
                                        checked: room.hasAC,
                                    },
                                    {
                                        id: "hasParking",
                                        label: "Parking",
                                        checked: room.hasParking,
                                    },
                                ].map((feature) => (
                                    <label
                                        key={feature.id}
                                        className="flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm"
                                        style={{
                                            borderColor: "var(--color-border)",
                                        }}>
                                        <input
                                            type="checkbox"
                                            name={feature.id}
                                            defaultChecked={feature.checked}
                                            className="h-4 w-4"
                                            style={{
                                                accentColor: "var(--color-forest-600)",
                                            }}
                                        />
                                        {feature.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2
                                className="text-lg font-semibold"
                                style={{
                                    color: "var(--color-forest-900)",
                                }}>
                                Schedule
                            </h2>

                            <div className="mt-4 grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="room-check-in"
                                        className="block text-sm font-medium">
                                        Check-in time
                                    </label>

                                    <input
                                        id="room-check-in"
                                        name="checkInTime"
                                        type="time"
                                        defaultValue={toTimeInputValue(room.checkInTime)}
                                        required
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
                                        style={{
                                            borderColor: "var(--color-border)",
                                        }}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="room-check-out"
                                        className="block text-sm font-medium">
                                        Check-out time
                                    </label>

                                    <input
                                        id="room-check-out"
                                        name="checkOutTime"
                                        type="time"
                                        defaultValue={toTimeInputValue(room.checkOutTime)}
                                        required
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
                                        style={{
                                            borderColor: "var(--color-border)",
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
                                Room Image
                            </h2>

                            <div className="mt-4">
                                <div className="overflow-hidden rounded-lg border">
                                    <img
                                        src={room.image}
                                        alt={`${room.name} room`}
                                        className="h-64 w-full object-cover"
                                    />
                                </div>

                                <label
                                    htmlFor="room-image"
                                    className="mt-4 block text-sm font-medium">
                                    Replace image
                                </label>

                                <input
                                    id="room-image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors file:mr-4 file:rounded-md file:border-0 file:bg-[var(--color-forest-100)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-forest-800)]"
                                    style={{
                                        borderColor: "var(--color-border)",
                                    }}
                                />

                                <p
                                    className="mt-2 text-xs"
                                    style={{
                                        color: "var(--color-muted)",
                                    }}>
                                    Leave this empty to keep the current image.
                                </p>
                            </div>
                        </div>

                        <div
                            className="flex justify-end gap-3 border-t pt-6"
                            style={{
                                borderColor: "var(--color-border)",
                            }}>
                            <CancelEditButton roomId={id} />
                            <SaveEditRoomButton />
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}