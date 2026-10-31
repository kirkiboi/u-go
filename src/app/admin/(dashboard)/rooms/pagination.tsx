"use client";

import { useState } from "react";
import Link from "next/link";
import type { Room } from "@prisma/client";
import { formatTime } from "@/lib/time";
const ROOMS_PER_PAGE = 4;

export default function RoomsList({ rooms }: { rooms: Room[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(rooms.length / ROOMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROOMS_PER_PAGE;
    const visibleRooms = rooms.slice(
        startIndex,
        startIndex + ROOMS_PER_PAGE
    );

    return (
        <>
            <div className="mt-8 space-y-4">
                {visibleRooms.map((room) => (
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
                                        <strong>{room.maxGuests}</strong>{" "}
                                        max guests
                                    </span>
                                    <span>
                                        <strong>{formatTime(room.checkInTime)}</strong>{" "}
                                        Check In
                                    </span>
                                    <span>
                                        <strong>{formatTime(room.checkOutTime)}</strong>{" "}
                                        Check Out
                                    </span>
                                    <span>
                                        <strong>
                                            ₱{room.price.toLocaleString("en-PH")}
                                        </strong>
                                        /night
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
                                        color: "var(--color-forest-800)",
                                    }}>
                                    View Room
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between gap-4">
                    <p
                        className="text-sm"
                        style={{ color: "var(--color-muted)" }}>
                        Showing {startIndex + 1}–
                        {Math.min(startIndex + ROOMS_PER_PAGE, rooms.length)}{" "}
                        of {rooms.length} rooms
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((page) => page - 1)}
                            disabled={currentPage <= 1}
                            aria-disabled={currentPage <= 1}
                            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${currentPage <= 1 ? "pointer-events-none opacity-40 cursor-default" : "bg-gray-50 cursor-pointer hover:bg-gray-100"}`}
                            style={{ borderColor: "var(--color-border)" }}>
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => setCurrentPage(page)}
                                aria-current={currentPage === page ? "page" : undefined}
                                className="rounded-lg border px-3 py-2 text-sm font-medium cursor-pointer transition-colors"
                                style={{
                                    borderColor: currentPage === page ? "var(--color-forest-500)" : "var(--color-border)",
                                    backgroundColor: currentPage === page ? "var(--color-forest-100)" : "white",
                                    color: currentPage === page ? "var(--color-forest-900)" : "var(--color-muted)",
                                }}>
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => setCurrentPage((page) => page + 1)}
                            disabled={currentPage >= totalPages}
                            aria-disabled={currentPage >= totalPages}
                            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${currentPage >= totalPages ? "pointer-events-none opacity-40 cursor-default" : "bg-gray-50 cursor-pointer hover:bg-gray-100"}`}
                            style={{ borderColor: "var(--color-border)" }}>
                            Next
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
