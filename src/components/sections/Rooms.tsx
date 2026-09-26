"use client";

import { useState } from "react";
import RoomCard from "@/components/reusable/RoomCard";
import type { Room } from "@/types/room";

const rooms: Room[] = [
    {
        name: "Cabin House",
        description:
            "A cozy mountain escape for up to 3 guests, offering a peaceful atmosphere surrounded by trees and nature.",
        price: "₱2,999",
        image: "/images/ugo_cabinsandbonfire.jpg",
    },
    {
        name: "Pinetree House",
        description:
            "A good for 6 people house designed for a relaxing escape, surrounded by pine trees, peaceful scenery, and the beauty of nature, with its own kitchen.",
        price: "₱4,500",
        image: "/images/ugo_house_outside.jpg",
    },
    {
        name: "Mountain View Cottage",
        description:
            "A spacious getaway for up to 15 guests, perfect for groups seeking a relaxing stay surrounded by nature, peaceful scenery, and an exclusive swimming pool.",
        price: "₱8,999",
        image: "/images/ugo_houses_with_pool.jpg",
    },
];

export default function Rooms() {
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
                                d="M15 19l-7-7 7-7" />
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
                            key={room.name}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`View ${room.name} `}
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