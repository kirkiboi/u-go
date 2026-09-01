import RoomCard from "@/components/reusable/RoomCard";
import type { Room } from "@/types/room";
const rooms: Room[] = [
    {
        name: "Pinetree House",
        description:
            "A good for 6 people house designed for a relaxing escape, surrounded by pine trees, peaceful scenery, and the beauty of nature, with its own exclusive swimming pool.",
        price: "₱3,500",
        image: "/images/ugo_cabinsandbonfire.jpg",
    },

];
export default function Rooms() {
    return (
        <section
            id="rooms"
            className="px-6 py-20"
            style={{
                backgroundColor: "var(--color-bg)",
            }}
        >
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <h2
                        className="text-4xl font-semibold md:text-5xl"
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "var(--color-forest-900)",
                        }}
                    >
                        Our Rooms
                    </h2>
                    <p
                        className="mx-auto mt-4 max-w-xl text-sm leading-relaxed"
                        style={{
                            color: "var(--color-stone-600)",
                        }}
                    >
                        Find a comfortable retreat surrounded by the beauty
                        of Valencia City's mountains.
                    </p>
                </div>
                <div className="flex flex-col gap-8">
                    {rooms.map((room) => (
                        <RoomCard
                            key={room.name}
                            room={room}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}