import BookingForm from "@/components/bookings/BookingForm";
import { getRooms } from "@/services/room";

export default async function BookingPage() {
  const rooms = await getRooms();

  return <BookingForm rooms={rooms} />;
}