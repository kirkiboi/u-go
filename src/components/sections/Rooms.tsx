"use client";

import { useState } from "react";
import RoomCard from "@/components/reusable/RoomCard";
import type { Room } from "@/types/room";

type RoomsProps = {
    rooms: Room[];
};

export default function Rooms({ rooms }: RoomsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentRoom = rooms[currentIndex];
    const previousRoom = () => {
        setCurrentIndex((currentIndex - 1 + rooms.length) % rooms.length);
    };
    const nextRoom = () => {
        setCurrentIndex((currentIndex + 1) % rooms.length);
    };
    return (
        <section
            id="rooms"
            className="px-6 py-20"
            style={{
                backgroundColor: "var(--color-bg)",
            }}>
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <h2
                        className="text-4xl font-semibold md:text-5xl"
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "var(--color-forest-900)",
                        }}>
                        Our Rooms
                    </h2>

                    <p
                        className="mx-auto mt-4 max-w-xl text-sm leading-relaxed"
                        style={{
                            color: "var(--color-stone-600)",
                        }}>
                        Find a comfortable retreat surrounded by the beauty
                        of Valencia City's mountains.
                    </p>
                </div>
                <div className="relative flex items-center justify-center">
                    <button
                        onClick={previousRoom}
                        aria-label="Previous room"
                        className="absolute left-0 z-10 flex h-12 w-12 -translate-x-2 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:-translate-x-3 hover:shadow-lg md:-translate-x-6 cursor-pointer"
                        style={{
                            color: "var(--color-forest-800)",
                        }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <RoomCard room={currentRoom} />
                    <button
                        onClick={nextRoom}
                        aria-label="Next room"
                        className="absolute right-0 z-10 flex h-12 w-12 translate-x-2 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:translate-x-3 hover:shadow-lg md:translate-x-6 cursor-pointer"
                        style={{
                            color: "var(--color-forest-800)",
                        }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>

                <div className="mt-8 flex justify-center gap-2">
                    {rooms.map((room, index) => (
                        <button
                            key={room.id}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`View ${room.name}`}
                            className="h-2 rounded-full transition-all duration-300 cursor-pointer"
                            style={{
                                width: index === currentIndex ? "24px" : "8px",
                                backgroundColor:
                                    index === currentIndex
                                        ? "var(--color-forest-700)"
                                        : "var(--color-stone-300)",
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}