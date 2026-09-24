import type { Room } from "@/types/room";
function RoomCard({ room }: { room: Room }) {
    return (
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg md:flex">
            <div className="h-72 md:h-auto md:w-1/2">
                <img
                    src={room.image}
                    alt="Mountain cottage surrounded by nature"
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="flex flex-col justify-center p-8 md:w-1/2 lg:p-10">
                <h3
                    className="text-3xl font-semibold"
                    style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--color-forest-900)",
                    }}
                >
                    {room.name}
                </h3>
                <p
                    className="mt-4 text-sm leading-relaxed"
                    style={{
                        color: "var(--color-stone-600)",
                    }}
                >
                    {room.description}
                </p>
                <div className="mt-8 flex items-center justify-between border-t pt-6"
                    style={{
                        borderColor: "var(--color-border)",
                    }}
                >
                    <div>
                        <p
                            className="text-xs"
                            style={{
                                color: "var(--color-stone-500)",
                            }}
                        >
                            Starting from
                        </p>
                        <p
                            className="text-2xl font-semibold"
                            style={{
                                color: "var(--color-forest-900)",
                            }}
                        >
                            {room.price}
                            <span className="ml-1 text-xs font-normal text-stone-500">
                                / night
                            </span>
                        </p>
                    </div>

                    <button
                        className="group flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 cursor-pointer"
                        style={{
                            backgroundColor: "var(--color-forest-800)",
                        }}
                    >
                        <span>Take a look inside</span>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14m-6-6 6 6-6 6"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default RoomCard;