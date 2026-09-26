import Link from "next/link";
import RoomCard from "@/components/reusable/RoomCard";
import type { Room } from "@/types/room";

const ROOMS_DATA: Room[] = [
  {
    id: "cabin-house",
    name: "Cabin House",
    description:
      "A cozy wooden retreat tucked away in the trees. Perfect for couples or solo travelers looking to reconnect with nature in absolute tranquility.",
    price: "₱3,500",
    image:
      "/images/ugo_cabinsandbonfire.jpg",
    maxGuests: 2,
    beds: 1,
    bedType: "Queen Size",
    bedrooms: 1,
    bathrooms: 1,
    hasPrivatePool: false,
    hasKitchen: false,
    hasWifi: true,
    hasParking: true,
    hasAC: true,
    checkInTime: "2:00 PM",
    checkOutTime: "12:00 NN",
    amenities: ["Mountain View", "Private Balcony", "Hot Shower"],
  },
  {
    id: "pinetree-house",
    name: "Pinetree House",
    description:
      "A beautifully structured house surrounded by tall pine trees. The large windows provide an immersive forest experience right from your bed.",
    price: "₱4,200",
    image:
      "/images/ugo_cabinsandbonfire.jpg",
    maxGuests: 3,
    beds: 2,
    bedType: "1 Queen, 1 Single",
    bedrooms: 1,
    bathrooms: 1,
    hasPrivatePool: false,
    hasKitchen: true,
    hasWifi: true,
    hasParking: true,
    hasAC: true,
    checkInTime: "2:00 PM",
    checkOutTime: "12:00 NN",
    amenities: ["Mini Fridge", "Work Desk", "Coffee Maker"],
  },
  {
    id: "mountain-view-cottage",
    name: "Mountain View Cottage",
    description:
      "Perched on an elevated ridge, this cottage offers unobstructed panoramic views of the distant peaks. Wake up to breathtaking sunrises.",
    price: "₱5,500",
    image:
      "/images/ugo_cabinsandbonfire.jpg",
    maxGuests: 4,
    beds: 2,
    bedType: "Queen Size",
    bedrooms: 2,
    bathrooms: 1,
    hasPrivatePool: false,
    hasKitchen: true,
    hasWifi: true,
    hasParking: true,
    hasAC: true,
    checkInTime: "2:00 PM",
    checkOutTime: "12:00 NN",
    amenities: ["Viewing Deck", "BBQ Grill", "Hammock"],
  },
  {
    id: "forest-haven-house",
    name: "Forest Haven House",
    description:
      "A secluded modern house built into the natural landscape. Features luxury amenities and complete privacy for the ultimate mountain getaway.",
    price: "₱7,800",
    image:
      "/images/ugo_cabinsandbonfire.jpg",
    maxGuests: 6,
    beds: 3,
    bedType: "3 Queen Size",
    bedrooms: 3,
    bathrooms: 2,
    hasPrivatePool: true,
    hasKitchen: true,
    hasWifi: true,
    hasParking: true,
    hasAC: true,
    checkInTime: "2:00 PM",
    checkOutTime: "12:00 NN",
    amenities: ["Private Pool", "Full Kitchen", "Living Area", "Smart TV"],
  },
  {
    id: "evergreen-family-villa",
    name: "Evergreen Family Villa",
    description:
      "Our most spacious offering, designed for large families or groups of friends. Combines luxury living with the serenity of the great outdoors.",
    price: "₱12,000",
    image:
      "/images/ugo_cabinsandbonfire.jpg",
    maxGuests: 10,
    beds: 5,
    bedType: "2 King, 3 Queen",
    bedrooms: 4,
    bathrooms: 3,
    hasPrivatePool: true,
    hasKitchen: true,
    hasWifi: true,
    hasParking: true,
    hasAC: true,
    checkInTime: "2:00 PM",
    checkOutTime: "12:00 NN",
    amenities: ["Private Plunge Pool", "Outdoor Dining Area", "Fire Pit", "Spacious Lounge"],
  },
];

export default function RoomsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-[var(--color-bg)]">
      <section className="px-4 py-16 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-forest-900)" }}>
          Our Accommodations
        </h1>
        <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover your perfect mountain escape. From cozy cabins to spacious family villas, every room is designed to blend seamlessly with nature while offering the utmost comfort.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="rounded-3xl overflow-hidden shadow-xl bg-white border border-[var(--color-border)] flex flex-col lg:flex-row">
          <div className="lg:w-3/5 h-[400px] lg:h-auto relative">
            <img
              src={ROOMS_DATA[4].image}
              alt={ROOMS_DATA[4].name}
              className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-[var(--color-forest-800)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Featured
            </div>
          </div>
          <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-forest-900)" }}>
              {ROOMS_DATA[4].name}
            </h2>
            <p className="text-stone-600 mb-6 leading-relaxed">
              {ROOMS_DATA[4].description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-stone-700">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--color-forest-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Up to {ROOMS_DATA[4].maxGuests} Guests
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--color-forest-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {ROOMS_DATA[4].bedrooms} Bedrooms
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--color-forest-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Private Pool
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--color-forest-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Air-conditioned
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">From</p>
                <p className="text-2xl font-bold text-[var(--color-forest-900)]">
                  {ROOMS_DATA[4].price}<span className="text-sm font-normal text-stone-500"> / night</span>
                </p>
              </div>
              <Link
                href="/booking"
                className="bg-[var(--color-forest-800)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--color-forest-700)] transition-colors inline-block">
                Book This Villa
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h3
          className="text-2xl font-bold mb-8 text-center"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-forest-900)" }}>
          More Accommodations
        </h3>

        <div className="grid grid-cols-1 gap-12">
          {ROOMS_DATA.slice(0, 4).map((room, index) => (
            <div key={room.id} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow`}>
              <div className="w-full md:w-1/2 h-64 md:h-auto">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-forest-900)" }}>
                    {room.name}
                  </h4>
                  <p className="text-xl font-semibold text-[var(--color-forest-800)] text-right">
                    {room.price}<span className="text-sm font-normal text-stone-500 block md:inline"> / night</span>
                  </p>
                </div>

                <p className="text-stone-600 mb-6 flex-grow">{room.description}</p>

                <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8 text-sm text-stone-700">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{room.maxGuests}</span> Guests
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{room.beds}</span> {room.bedType}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{room.bathrooms}</span> Bathrooms
                  </div>
                  {room.hasKitchen && (
                    <div className="flex items-center gap-1">Kitchen included</div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 border-t border-[var(--color-border)] pt-6">
                  <Link
                    href="/booking"
                    className="flex-1 text-center bg-[var(--color-forest-800)] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[var(--color-forest-700)] transition-colors">
                    Book This Room
                  </Link>
                  <button className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg font-semibold border border-[var(--color-border)] text-stone-700 hover:bg-stone-50 transition-colors">
                    Take a look inside
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}