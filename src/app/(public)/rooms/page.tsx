import Link from "next/link";
import ScrollReveal from "@/components/reusable/ScrollReveal";
import { getRooms } from "@/services/room";
import Image from "next/image";

export default async function RoomsPage() {
  const rooms = await getRooms();

  const featuredRoom = rooms[0];
  const otherRooms = rooms.slice(1);

  if (!featuredRoom) {
    return (
      <main className="min-h-screen pt-24 pb-16 bg-[var(--color-bg)]">
        <section className="px-4 py-24 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-forest-900)",
            }}>
            Our Accommodations
          </h1>

          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Our accommodations are currently being prepared.
            Please check back soon.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[var(--color-bg)]">
      <section className="px-4 py-16 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-forest-900)",
          }}>
          Our Accommodations
        </h1>
        <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover your perfect mountain escape. From cozy cabins to
          spacious family villas, every room is designed to blend
          seamlessly with nature while offering the utmost comfort.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="rounded-3xl overflow-hidden shadow-xl bg-white border border-[var(--color-border)] flex flex-col lg:flex-row">
          <div className="lg:w-3/5 h-[400px] lg:h-auto relative">
            <Image
              src={featuredRoom.image}
              alt={featuredRoom.name}
              fill
              className="object-cover"
            />

            <div className="absolute top-4 left-4 bg-[var(--color-forest-800)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Featured
            </div>
          </div>
          <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
            <h2
              className="text-3xl font-bold mb-4"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-forest-900)",
              }}>
              {featuredRoom.name}
            </h2>
            <p className="text-stone-600 mb-6 leading-relaxed">
              {featuredRoom.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-stone-700">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[var(--color-forest-500)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>

                Up to {featuredRoom.maxGuests} Guests
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[var(--color-forest-500)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a9 9 0 001 1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>

                {featuredRoom.beds ?? 0} Bed(s)
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[var(--color-forest-500)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>

                {featuredRoom.hasPrivatePool
                  ? "Private Pool"
                  : "No Private Pool"}
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[var(--color-forest-500)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>

                {featuredRoom.hasAC
                  ? "Air-conditioned"
                  : "No Air Conditioning"}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">
                  From
                </p>

                <p className="text-2xl font-bold text-[var(--color-forest-900)]">
                  {featuredRoom.price}
                  <span className="text-sm font-normal text-stone-500">
                    {" "}
                    / night
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/booking"
                  className="bg-[var(--color-forest-800)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--color-forest-700)] transition-colors inline-block text-center">
                  Book This Villa
                </Link>

                <Link
                  href={`/rooms/${featuredRoom.id}`}
                  className="px-5 py-2.5 rounded-lg font-semibold border border-[var(--color-border)] text-stone-700 hover:bg-stone-50 transition-colors inline-flex items-center justify-center gap-2">
                  <span>Take a look inside</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {otherRooms.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <ScrollReveal>
            <h3
              className="text-2xl font-bold mb-8 text-center"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-forest-900)",
              }}>
              More Accommodations
            </h3>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 gap-12">
              {otherRooms.map((room, index) => (
                <ScrollReveal key={room.id}>
                  <div
                    key={room.id}
                    className={`flex flex-col ${index % 2 === 1
                      ? "md:flex-row-reverse"
                      : "md:flex-row"
                      } bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow`}>
                    <div className="relative w-full md:w-1/2 h-64 md:h-[400px]">
                      <Image
                        src={room.image}
                        alt={room.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-4">
                        <h4
                          className="text-2xl font-bold"
                          style={{
                            fontFamily:
                              "var(--font-display)",
                            color:
                              "var(--color-forest-900)",
                          }}>
                          {room.name}
                        </h4>

                        <p className="text-xl font-semibold text-[var(--color-forest-800)] text-right">
                          {room.price}
                          <span className="text-sm font-normal text-stone-500 block md:inline">
                            {" "}
                            / night
                          </span>
                        </p>
                      </div>

                      <p className="text-stone-600 mb-6 flex-grow">
                        {room.description}
                      </p>

                      <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8 text-sm text-stone-700">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">
                            {room.maxGuests}
                          </span>{" "}
                          Guests
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="font-semibold">
                            {room.beds}
                          </span>{" "}
                          {room.bedType ?? "Beds"}
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="font-semibold">
                            {room.bathrooms}
                          </span>{" "}
                          Bathrooms
                        </div>

                        {room.hasKitchen && (
                          <div className="flex items-center gap-1">
                            Kitchen included
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 border-t border-[var(--color-border)] pt-6">
                        <Link
                          href="/booking"
                          className="flex-1 text-center bg-[var(--color-forest-800)] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[var(--color-forest-700)] transition-colors">
                          Book This Room
                        </Link>

                        <Link
                          href={`/rooms/${room.id}`}
                          className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg font-semibold border border-[var(--color-border)] text-stone-700 hover:bg-stone-50 transition-colors">
                          <span>
                            Take a look inside
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}
    </main>
  );
}