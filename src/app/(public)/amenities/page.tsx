import AmenityCard from "@/components/reusable/AmenitiesCard";
import { getAmenities } from "@/services/amenity";

export default async function AmenitiesPage() {
  const amenities = await getAmenities();

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[var(--color-bg)]">
      <section className="px-4 py-16 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-forest-900)" }}>
          Resort Amenities
        </h1>
        <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Elevate your mountain retreat with our curated experiences. Whether you seek adventure, relaxation, or connection, our facilities are designed to help you create unforgettable memories.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex flex-col group">
              <AmenityCard
                amenity={{
                  name: amenity.name,
                  description: amenity.description,
                  image: amenity.image,
                }}
              />
              <div className="mt-4 px-2">
                <div className="flex items-center text-stone-500 text-sm">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {amenity.timeDescription}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}