import Hero from "@/components/sections/Hero";
import Rooms from "@/components/sections/Rooms";
import Amenities from "@/components/sections/Amenities";
import Location from "@/components/sections/Location";
import Booking from "@/components/sections/Booking";


export default function HomePage() {
  return (
    <main>
      <Hero></Hero>
      <Rooms></Rooms>
      <Amenities></Amenities>
      <Location></Location>
      <Booking></Booking>
    </main>
  );
}