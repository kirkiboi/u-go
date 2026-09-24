import AmenityCard from "@/components/reusable/AmenitiesCard";

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
            }}
        >
            <div className="mx-auto max-w-7xl">
                <div className="mb-14 max-w-2xl">
                    <h2
                        className="text-4xl font-semibold md:text-5xl"
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "white",
                        }}
                    >
                        Everything you need
                        <br />
                        for a perfect escape.
                    </h2>

                    <p
                        className="mt-5 max-w-xl text-sm leading-relaxed"
                        style={{
                            color: "var(--color-forest-200)",
                        }}
                    >
                        From relaxing by the pool to enjoying the mountain
                        scenery, discover the experiences waiting for you at
                        U-Go Mountain Resort.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {amenities.map((amenity) => (
                        <AmenityCard
                            key={amenity.name}
                            amenity={amenity}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}