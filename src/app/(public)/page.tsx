import Hero from "@/components/sections/Hero";
import Rooms from "@/components/sections/Rooms";
import Amenities from "@/components/sections/Amenities";
import Location from "@/components/sections/Location";
import Booking from "@/components/sections/Booking";
import ScrollReveal from "@/components/reusable/ScrollReveal";


export default function HomePage() {
  return (
    <main>
      <Hero></Hero>
      <ScrollReveal><Rooms></Rooms></ScrollReveal>
      <ScrollReveal><Amenities></Amenities></ScrollReveal>
      <ScrollReveal><Location></Location></ScrollReveal>
      <ScrollReveal><Booking></Booking></ScrollReveal>
    </main >
  );
}