import Hero from "@/components/sections/Hero";
import Rooms from "@/components/sections/Rooms";
import Amenities from "@/components/sections/Amenities";
import Location from "@/components/sections/Location";
import Booking from "@/components/sections/Booking";
import ScrollReveal from "@/components/reusable/ScrollReveal";
import { getRooms } from "@/services/room";
import { getAmenities } from "@/services/amenity";

export default async function HomePage() {
  const rooms = await getRooms();
  const amenities = await getAmenities();

  return (
    <main>
      <Hero />

      <ScrollReveal>
        <Rooms rooms={rooms} />
      </ScrollReveal>

      <ScrollReveal>
        <Amenities amenities={amenities} />
      </ScrollReveal>

      <ScrollReveal>
        <Location />
      </ScrollReveal>

      <ScrollReveal>
        <Booking />
      </ScrollReveal>
    </main>
  );
}