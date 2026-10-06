"use server";

import { redirect } from "next/navigation";
import { deleteRoom, getRoomById } from "@/services/room";
import { deleteRoomImage } from "@/services/imageService";

export async function removeRoom(roomId: number) {
    const room = await getRoomById(roomId);

    if (!room) {
        throw new Error("Room not found.");
    }

    await deleteRoomImage(room.image);
    await deleteRoom(roomId);

    redirect("/admin/rooms");
}