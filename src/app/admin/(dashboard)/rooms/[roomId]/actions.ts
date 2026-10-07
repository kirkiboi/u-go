"use server";

import { redirect } from "next/navigation";
import { deleteRoom, getRoomById } from "@/services/room";
import { deleteImage } from "@/services/imageService";
import { requireAdmin } from "@/lib/authorization";

export async function removeRoom(roomId: number) {
    await requireAdmin();
    const room = await getRoomById(roomId);

    if (!room) {
        throw new Error("Room not found.");
    }

    await deleteImage(room.image);
    await deleteRoom(roomId);

    redirect("/admin/rooms");
}