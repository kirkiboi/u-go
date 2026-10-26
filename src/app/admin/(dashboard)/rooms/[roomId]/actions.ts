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

    await deleteRoom(roomId);
    try {
        await deleteImage(room.image);
    } catch (error) {
        console.error(
            `Room ${roomId} was deleted, but its image could not be removed:`,
            error
        );
    }

    redirect("/admin/rooms");
}