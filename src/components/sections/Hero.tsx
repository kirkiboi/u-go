import Link from "next/link";
export default function Hero() {
    return (
        <div>
            <div
                className="flex items-center"
                style={{
                    backgroundColor: "var(--color-forest-800)",
                }}
            >
                <div className="flex-1 flex flex-col gap-4 p-6">
                    <div className="flex flex-col items-center justify-center gap-1">
                        <h1
                            className="text-5xl font-medium"
                            style={{
                                color: "var(--color-forest-200)",
                            }}
                        >
                            Mountain
                        </h1>

                        <h1 className="text-5xl font-semibold text-white">
                            Cottages
                        </h1>
                    </div>

                    <div className="flex items-center justify-center gap-3 text-xs text-white/80">
                        <span>Cottage Town</span>
                        <span className="text-white/40">•</span>
                        <span>Restaurant</span>
                        <span className="text-white/40">•</span>
                        <span>Spa Complex</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6">
                    <p className="max-w-md text-center text-sm leading-relaxed text-white/85">
                        Our cottages in Valencia City are strategically placed in a
                        perfect spot for an escape from the hustle and bustle of the
                        city and a chance to recharge your batteries.
                    </p>

                    <Link
                        href="/rooms"
                        className="group flex items-center gap-3 rounded-md px-5 py-3 text-sm font-semibold
               transition-all duration-200 hover:-translate-y-0.5 cursor-pointer hover:shadow-lg
               focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{
                            backgroundColor: "var(--color-forest-200)",
                            color: "var(--color-forest-900)",
                        }}
                    >
                        <span>CHECK OUR ROOMS</span>

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
                                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                            />
                        </svg>
                    </Link>

                    <div className="flex items-center gap-2 text-xs text-white/70">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.75}
                            stroke="currentColor"
                            className="h-4 w-4 shrink-0"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 10.5c0 5.25-7.5 10.5-7.5 10.5S4.5 15.75 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                            />
                        </svg>

                        <span>
                            Brgy. Lourdes, Valencia City, Bukidnon, 8709
                        </span>
                    </div>
                </div>
            </div>

            <section className=" relative h-[500px] flex items-center justify-center px-4
                                bg-[url('/images/ugo_cabinsandbonfire.jpg')] bg-cover bg-center bg-no-repeat"
            >
                <div className="absolute inset-0 bg-black/30" />
                <div
                    className="absolute bottom-8 left-1/2.5 translate-x-1/ z-10 flex
                                flex-col items-center gap-2 text-white">
                    <span className="text-[10px] uppercase tracking-[0.25em]">
                        Take a stroll with us
                    </span>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5 animate-bounce"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19 9-7 7-7-7"
                        />
                    </svg>
                </div>
            </section>
        </div>
    )
}