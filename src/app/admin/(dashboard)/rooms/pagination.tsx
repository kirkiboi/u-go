
"use client";

import { useState } from "react";
import Link from "next/link";
import type { Room } from "@prisma/client";
import { formatTime } from "@/lib/time";
import RestoreRoomButton from "@/components/admin/restoreRoomButton";

const ROOMS_PER_PAGE = 4;

export default function RoomsList({
    rooms,
    archivedRooms,
}: {
    rooms: Room[];
    archivedRooms: Room[];
}) {
    const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
    const [currentPage, setCurrentPage] = useState(1);
    const displayedRooms = activeTab === "active" ? rooms : archivedRooms;
    const totalPages = Math.ceil(displayedRooms.length / ROOMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROOMS_PER_PAGE;
    const visibleRooms = displayedRooms.slice(startIndex, startIndex + ROOMS_PER_PAGE);

    const switchTab = (tab: "active" | "archived") => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <>
            <div className="mt-8 flex flex-wrap gap-3 border-b"
                style={{ borderColor: "var(--color-border)" }}>
                <button
                    type="button"
                    onClick={() => switchTab("active")}
                    className="border-b-2 px-4 py-3 text-sm font-semibold transition-colors hover:cursor-pointer"
                    style={{
                        borderColor: activeTab === "active" ? "var(--color-forest-700)" : "transparent",
                        color: activeTab === "active" ? "var(--color-forest-800)" : "var(--color-muted)",
                    }}>
                    Active Rooms ({rooms.length})
                </button>

                <button
                    type="button"
                    onClick={() => switchTab("archived")}
                    className="border-b-2 px-4 py-3 text-sm font-semibold transition-colors hover:cursor-pointer"
                    style={{
                        borderColor: activeTab === "archived" ? "var(--color-forest-700)" : "transparent",
                        color: activeTab === "archived" ? "var(--color-forest-800)" : "var(--color-muted)",
                    }}>
                    Archived Rooms ({archivedRooms.length})
                </button>
            </div>

            {displayedRooms.length === 0 ? (
                <div className="mt-8 rounded-xl border bg-white px-6 py-12 text-center"
                    style={{ borderColor: "var(--color-border)" }}>
                    <h2
                        className="text-lg font-semibold"
                        style={{ color: "var(--color-forest-900)" }}>
                        {activeTab === "active" ? "No active rooms" : "No archived rooms"}
                    </h2>
                    <p className="mt-2 text-sm"
                        style={{ color: "var(--color-muted)" }}>
                        {activeTab === "active" ? "There are currently no active rooms." : "Rooms you archive will appear here."}
                    </p>
                </div>
            ) : (
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
                                        <div className="flex flex-wrap items-center gap-3">
                                            <p
                                                className="text-base font-semibold"
                                                style={{
                                                    color: "var(--color-forest-900)",
                                                }}>
                                                {room.name}
                                            </p>

                                            {activeTab === "archived" && (
                                                <span className="rounded-full px-2.5 py-1 text-xs font-medium"
                                                    style={{
                                                        backgroundColor: "var(--color-stone-100)",
                                                        color: "var(--color-muted)",
                                                    }}>
                                                    Archived
                                                </span>
                                            )}
                                        </div>
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

                                    <div className="flex shrink-0 flex-wrap gap-2">
                                        <Link
                                            href={`/admin/rooms/${room.id}`}
                                            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
                                            style={{
                                                backgroundColor: "var(--color-forest-100)",
                                                color: "var(--color-forest-800)",
                                            }}>
                                            View Room
                                        </Link>
                                        {activeTab === "archived" && (<RestoreRoomButton roomId={room.id} />)}
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
                                {Math.min(startIndex + ROOMS_PER_PAGE, displayedRooms.length)}{" "}
                                of {displayedRooms.length} rooms
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((page) => page - 1)}
                                    disabled={currentPage <= 1}
                                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${currentPage <= 1 ? "pointer-events-none opacity-40 cursor-default" : "bg-gray-50 cursor-pointer hover:bg-gray-100"}`}
                                    style={{ borderColor: "var(--color-border)" }}>
                                    Previous
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                ).map((page) => (
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
                                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${currentPage >= totalPages ? "pointer-events-none opacity-40 cursor-default" : "bg-gray-50 cursor-pointer hover:bg-gray-100"}`}
                                    style={{ borderColor: "var(--color-border)" }}>
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}