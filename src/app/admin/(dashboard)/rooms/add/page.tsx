import { addRoom } from "./actions";
import CancelAddButton from "@/components/admin/addRoomButtonCancel";
import SaveRoomButton from "@/components/admin/saveRoomButton";

export default function AddRoomPage() {
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
                        Add Room
                    </h1>
                </div>

                <form
                    id="add-room-form"
                    action={addRoom}
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
                                        name="name"
                                        id="room-name"
                                        type="text"
                                        placeholder="required"
                                        required
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)] "
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
                                        name="price"
                                        type="number"
                                        required
                                        placeholder="required"
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
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
                                required
                                rows={4}
                                placeholder="required" className="mt-2 w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
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
                                        name="maxGuests"
                                        id="room-guests"
                                        type="number"
                                        min="1"
                                        required
                                        placeholder="required"
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
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
                                        name="bedrooms"
                                        id="room-bedrooms"
                                        type="number"
                                        min="0"
                                        placeholder="optional"
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
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
                                        name="bathrooms"
                                        id="room-bathrooms"
                                        type="number"
                                        min="0"
                                        placeholder="optional"
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                                        style={{
                                            borderColor:
                                                "var(--color-border)",
                                        }}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="room-beds"
                                        className="block text-sm font-medium">
                                        Number of beds
                                    </label>
                                    <input
                                        id="room-beds"
                                        name="beds"
                                        type="number"
                                        min="1"
                                        placeholder="required"
                                        required
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                                        style={{
                                            borderColor: "var(--color-border)",
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <br />
                                <label
                                    htmlFor="room-bed-type"
                                    className="block text-sm font-medium">
                                    Bed type
                                </label>
                                <input
                                    id="room-bed-type"
                                    name="bedType"
                                    type="text"
                                    placeholder="optional"
                                    className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                                    style={{
                                        borderColor: "var(--color-border)",
                                    }}
                                />
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
                                    { label: "Wi-Fi", name: "hasWifi" },
                                    { label: "Kitchen", name: "hasKitchen" },
                                    { label: "Private Pool", name: "hasPrivatePool" },
                                    { label: "Air Conditioning", name: "hasAC" },
                                    { label: "Parking", name: "hasParking" },
                                ].map((feature) => (
                                    <label
                                        key={feature.name}
                                        className="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm"
                                        style={{
                                            borderColor: "var(--color-border)",
                                        }}>
                                        <input
                                            type="checkbox"
                                            name={feature.name}
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
                            <label
                                htmlFor="room-image"
                                className="block text-sm font-medium">
                                Image
                            </label>
                            <input
                                id="room-image"
                                name="image"
                                type="file"
                                accept="image/*"
                                required
                                className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors file:mr-4 file:rounded-md file:border-0 file:bg-[var(--color-forest-100)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-forest-800)]"
                                style={{
                                    borderColor: "var(--color-border)",
                                }}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Uploading an image of the room, either PNG or JPG, is required.
                            </p>
                        </div>
                        <div>
                            <label
                                htmlFor="check-in"
                                className="block text-sm font-medium">
                                Check-in time
                            </label>

                            <input
                                id="check-in"
                                name="checkInTime"
                                type="text"
                                placeholder="required"
                                required
                                className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                                style={{
                                    borderColor: "var(--color-border)",
                                }}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="check-out"
                                className="block text-sm font-medium">
                                Check-out time
                            </label>
                            <input
                                id="check-out"
                                name="checkOutTime"
                                type="text"
                                placeholder="required"
                                required
                                className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                                style={{
                                    borderColor: "var(--color-border)",
                                }}
                            />
                        </div>
                        <div
                            className="flex justify-end gap-3 border-t pt-6"
                            style={{
                                borderColor: "var(--color-border)",
                            }}>
                            <CancelAddButton />
                            <SaveRoomButton />
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}