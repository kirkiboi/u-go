import AmenityCard from "@/components/reusable/AmenitiesCard";
import Link from "next/link";

const amenities = [
    {
        name: "Swimming Pool",
        description:
            "Take a refreshing swim while enjoying the peaceful mountain surroundings.",
        image: "/images/swimming_pool.jpg",
    },
    {
        name: "Bonfire",
        description:
            "Gather around the crackling fire for warmth, late-night conversations, and starlit ambiance.",
        image: "/images/amenities_bonfire.jpg",
    },
    {
        name: "Cottage Town",
        description:
            "Relax and explore our collection of comfortable cottages surrounded by nature.",
        image: "/images/ugo_house_outside.jpg",
    },
    {
        name: "Mountain Views",
        description:
            "Wake up to breathtaking panoramic vistas overlooking the rolling landscapes of Valencia City.",
        image: "/images/amenities_mountain_views.jpg",
    },
];

export default function Amenities() {
    return (
        <section
            id="amenities"
            className="px-6 py-24"
            style={{
                backgroundColor: "var(--color-forest-900)",
            }}>
            <div className="mx-auto max-w-7xl">
                <div className="mb-14 max-w-2xl">
                    <h2
                        className="text-4xl font-semibold md:text-5xl"
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "white",
                        }}>
                        Everything you need
                        <br />
                        for a perfect escape.
                    </h2>
                    <p
                        className="mt-5 max-w-xl text-sm leading-relaxed"
                        style={{
                            color: "var(--color-forest-200)",
                        }}>
                        From relaxing by the pool to enjoying the mountain
                        scenery, discover the experiences waiting for you at
                        U-Go Mountain Resort.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {amenities.map((amenity) => (
                        <AmenityCard
                            key={amenity.name}
                            amenity={amenity} />
                    ))}
                </div>
                <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/10 px-8 py-8 text-center md:flex-row md:text-left">
                    <div>
                        <h3 className="mt-2 text-2xl font-semibold text-white md:text-3xl" style={{ fontFamily: "var(--font-display)", }}>
                            See it for yourself
                        </h3>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: "var(--color-forest-200)", }}>
                            Explore the surroundings, discover hidden corners, and experience U-Go Mountain Resort as if you were already here.
                        </p>
                    </div>
                    <Link
                        href="/amenities"
                        className="group inline-flex shrink-0 items-center gap-3 rounded-full
                        border px-6 py-3 text-sm font-semibold transition-all duration-300
                        hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-forest-900)]"
                        style={{
                            borderColor: "var(--color-forest-300)",
                            color: "var(--color-forest-300)",
                        }}>
                        <span>
                            Take a walk
                        </span>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14m-6-6 6 6-6 6"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}