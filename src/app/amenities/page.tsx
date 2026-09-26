import AmenityCard from "@/components/reusable/AmenitiesCard";

const AMENITIES_DATA = [
  {
    id: "swimming-pool",
    name: "Swimming Pool",
    description: "Take a refreshing dip in our mountain spring-fed pool, surrounded by lush forest greenery.",
    image: "images/test1.jpg",
    experience: "Relaxing aquatic experience for all ages",
    schedule: "7:00 AM - 9:00 PM",
  },
  {
    id: "bonfire-area",
    name: "Bonfire Area",
    description: "Gather around the fire pit in the evenings for s'mores, stories, and stargazing.",
    image: "images/test1.jpg",
    experience: "Cozy evening gatherings",
    schedule: "6:00 PM - 10:00 PM",
  },
  {
    id: "mountain-view-deck",
    name: "Mountain View Deck",
    description: "Our elevated deck offers the perfect vantage point for sunrise yoga or evening cocktails.",
    image: "images/test1.jpg",
    experience: "Breathtaking panoramic views",
    schedule: "Always Open",
  },
  {
    id: "outdoor-dining",
    name: "Outdoor Dining",
    description: "Enjoy locally sourced cuisine while dining al fresco amidst the whispering pine trees.",
    image: "images/test1.jpg",
    experience: "Culinary delights in nature",
    schedule: "6:00 AM - 10:00 PM",
  },
  {
    id: "stargazing-area",
    name: "Stargazing Area",
    description: "A secluded clearing away from the resort lights, equipped with comfortable loungers.",
    image: "images/test1.jpg",
    experience: "Unobstructed night sky views",
    schedule: "Best after 8:00 PM",
  },
  {
    id: "garden-walk",
    name: "Garden Walk",
    description: "Stroll through our beautifully landscaped paths featuring endemic flora and mountain orchids.",
    image: "images/test1.jpg",
    experience: "Peaceful nature immersion",
    schedule: "Always Open",
  },
];

export default function AmenitiesPage() {
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden group">
          <img
            src="images/ugo_cabinsandbonfire.jpg"
            alt="The Grand Lodge"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3 lg:w-1/2">
            <span className="text-[var(--color-forest-300)] font-semibold tracking-wider uppercase text-sm mb-2 block">
              Featured Experience
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
              The Grand Lodge
            </h2>
            <p className="text-white/90 text-lg mb-6 leading-relaxed">
              The heart of our resort. Gather by the monumental stone fireplace, enjoy artisanal coffee, or simply relax with a book in our expansive living area overlooking the valley.
            </p>
            <button className="bg-white text-[var(--color-forest-900)] px-6 py-3 rounded-lg font-semibold hover:bg-stone-100 transition-colors">
              Explore The Lodge
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h3
          className="text-3xl font-bold mb-12 text-center"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-forest-900)" }}>
          More Experiences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {AMENITIES_DATA.map((amenity) => (
            <div key={amenity.id} className="flex flex-col group">
              <AmenityCard amenity={{ name: amenity.name, description: amenity.description, image: amenity.image }} />
              <div className="mt-4 px-2">
                <p className="text-sm font-semibold text-[var(--color-forest-800)] mb-1 uppercase tracking-wide">
                  {amenity.experience}
                </p>
                <div className="flex items-center text-stone-500 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {amenity.schedule}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-24 mb-8">
        <div className="bg-[var(--color-forest-50)] p-12 rounded-3xl border border-[var(--color-forest-100)]">
          <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-forest-900)" }}>
            Ready to experience this for yourself?
          </h3>
          <p className="text-stone-600 mb-8 max-w-xl mx-auto">
            Book your stay today and get full access to all our amenities and breathtaking mountain experiences.
          </p>
          <a href="/booking" className="inline-block bg-[var(--color-forest-800)] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[var(--color-forest-700)] transition-colors shadow-lg hover:shadow-xl">
            Book Your Stay Now
          </a>
        </div>
      </section>
    </main>
  );
}
