type Amenity = {
    name: string;
    description: string;
    image: string;
};

function AmenityCard({ amenity }: { amenity: Amenity }) {
    return (
        <article
            className="group relative h-[360px] overflow-hidden rounded-2xl"
        >
            <img
                src={amenity.image}
                alt={amenity.name}
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-7">
                <h3
                    className="text-2xl font-semibold text-white"
                    style={{
                        fontFamily: "var(--font-display)",
                    }}
                >
                    {amenity.name}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
                    {amenity.description}
                </p>

                <div
                    className="mt-5 h-px w-10 transition-all duration-300 group-hover:w-20"
                    style={{
                        backgroundColor: "var(--color-forest-300)",
                    }}
                />
            </div>
        </article>
    );
}
export default AmenityCard;