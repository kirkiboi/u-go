import Link from "next/link";
import { getRoomById } from "@/services/room";
export default async function RoomDetailsPage({

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
                                    Maximum Guests
                                </p>
                                <p className="mt-1 font-semibold">
                                    {room.maxGuests}
                                </p>
                            </div>
                            {room.bedrooms !== null && room.bedrooms !== undefined ? (
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Bedrooms
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {room.bedrooms}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Bedrooms
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        0
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-gray-500">
                                    Bathrooms
                                </p>
                                <p className="mt-1 font-semibold">
                                    {room.bathrooms}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Bed Type
                                </p>
                                <p className="mt-1 font-semibold">
                                    {room.bedType ?? "Not specified"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Check-In
                                </p>
                                <p className="mt-1 font-semibold">
                                    {room.checkInTime}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Check-Out
                                </p>
                                <p className="mt-1 font-semibold">
                                    {room.checkOutTime}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Number of beds
                                </p>
                                <p className="mt-1 font-semibold">
                                    {room.beds}
                                </p>
                            </div>
                        </div>
                        <br />
                        <div>
                            <p className="text-xs text-gray-500">
                                Description
                            </p>
                            <p className="mt-1 font-semibold">
                                {room.description}
                            </p>
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
                                {
                                    label: "Wi-Fi",
                                    available: room.hasWifi,
                                },
                                {
                                    label: "Kitchen",
                                    available: room.hasKitchen,
                                },
                                {
                                    label: "Private Pool",
                                    available: room.hasPrivatePool,
                                },
                                {
                                    label: "Air Conditioning",
                                    available: room.hasAC,
                                },
                                {
                                    label: "Parking",
                                    available: room.hasParking,
                                },
                            ].map((feature) => (
                                <div
                                    key={feature.label}
                                    className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm"
                                    style={{
                                        borderColor: "var(--color-border)",
                                    }}>
                                    <span>{feature.label}</span>

                                    <span
                                        className="rounded-full px-2 py-1 text-xs font-medium"
                                        style={{
                                            backgroundColor: feature.available
                                                ? "var(--color-forest-100)"
                                                : "var(--color-stone-100)",
                                            color: feature.available
                                                ? "var(--color-forest-700)"
                                                : "var(--color-muted)",
                                        }}>
                                        {feature.available ? "Available" : "Not available"}
                                    </span>
                                </div>
                            ))}
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
                            Room Image
                        </h2>
                        <div className="mt-4 overflow-hidden rounded-lg border">
                            <img
                                src={room.image}
                                alt={`${room.name} room`}
                                className="h-auto max-h-[500px] w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}