export default function Location() {
    return (
        <section
            id="location"
            className="px-6 py-24"
            style={{
                backgroundColor: "var(--color-bg)",
            }}>
            <div className="mx-auto max-w-7xl">
                <div className="mb-14 text-center">
                    <p
                        className="mb-3 text-xs font-semibold uppercase tracking-[0.25em]"
                        style={{
                            color: "var(--color-forest-600)",
                        }}>
                        Find Your Way
                    </p>
                    <h2
                        className="text-4xl font-semibold md:text-5xl"
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "var(--color-forest-900)",
                        }}>
                        Where the mountains meet
                        <br />
                        tranquility.
                    </h2>
                    <p
                        className="mx-auto mt-5 max-w-xl text-sm leading-relaxed"
                        style={{
                            color: "var(--color-stone-600)",
                        }}>
                        Discover U-Go Mountain Resort in the peaceful
                        surroundings of Valencia City, Bukidnon.
                    </p>
                </div>
                <div className="grid overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-2">
                    <div className="relative min-h-[420px] overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps?q=7.8932551,124.9656661&z=16&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            title="UGO Cliff Resort Bukidnon location"
                            className="absolute inset-0 h-full w-full" />
                    </div>
                    <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                        <p
                            className="text-xs font-semibold uppercase tracking-[0.2em]"
                            style={{
                                color: "var(--color-forest-600)",
                            }}>
                            U-Go Mountain Resort
                        </p>
                        <h3
                            className="mt-3 text-3xl font-semibold md:text-4xl"
                            style={{
                                fontFamily: "var(--font-display)",
                                color: "var(--color-forest-900)",
                            }}>
                            Escape to the mountains.
                        </h3>
                        <p
                            className="mt-5 text-sm leading-relaxed"
                            style={{
                                color: "var(--color-stone-600)",
                            }}>
                            Our resort is located in Brgy. Lourdes,
                            Valencia City, Bukidnon, surrounded by peaceful
                            mountain scenery and nature.
                        </p>
                        <div
                            className="mt-8 flex gap-4 border-t pt-6"
                            style={{
                                borderColor: "var(--color-border)",
                            }}>
                            <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                                style={{
                                    backgroundColor:
                                        "var(--color-forest-100)",
                                }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.8}
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                    style={{
                                        color: "var(--color-forest-700)",
                                    }}>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                </svg>
                            </div>
                            <div>
                                <p
                                    className="text-xs font-semibold uppercase tracking-wide"
                                    style={{
                                        color: "var(--color-stone-500)",
                                    }}>
                                    Address
                                </p>
                                <p
                                    className="mt-1 text-sm leading-relaxed"
                                    style={{
                                        color: "var(--color-stone-800)",
                                    }}>
                                    Brgy. Lourdes, Valencia City,
                                    <br />
                                    Bukidnon, 8709
                                </p>
                            </div>
                        </div>
                        <a
                            href="https://www.google.com/maps/dir/?api=1&destination=7.8932551,124.9656661"
                            target="_blank"
                            className="group mt-8 inline-flex w-fit items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
                            style={{
                                backgroundColor:
                                    "var(--color-forest-800)",
                            }}>
                            <span>Get Directions</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 12h14m-6-6 6 6-6 6" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}