import Link from "next/link";
import { getRooms } from "@/services/room";
import RoomsList from "./pagination";
const ROOMS_PER_PAGE = 4;

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
                        <RoomsList rooms={rooms} />
                    </>
                )}
            </div>
        </section>
    );
}