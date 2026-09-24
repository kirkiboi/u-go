
export default function BookingCTA() {
    return (
        <section
            id="booking"
            className="relative overflow-hidden px-6 py-28"
            style={{
                backgroundColor: "var(--color-forest-900)",
            }}>
            <div className="relative z-10 mx-auto max-w-3xl text-center">
                <p
                    className="mb-4 text-xs font-semibold uppercase tracking-[0.3em]"
                    style={{
                        color: "var(--color-forest-300)",
                    }}>
                    Your Mountain Escape Awaits
                </p>
                <h2
                    className="text-4xl font-semibold text-white md:text-5xl lg:text-6xl"
                    style={{
                        fontFamily: "var(--font-display)",
                    }}>
                    Ready to leave the
                    <br />
                    city behind?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
                    Experience peaceful mountain scenery, comfortable
                    cottages, and unforgettable moments at U-Go Mountain
                    Resort.
                </p>
                <a
                    href="#"
                    className="group mt-9 inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:brightness-110"
                    style={{
                        backgroundColor: "var(--color-forest-700)",
                        boxShadow: "0 8px 24px rgba(13, 26, 16, 0.35)",
                    }}>
                    <span>Book a Cottage</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                </a>
            </div>
        </section>
    );
}