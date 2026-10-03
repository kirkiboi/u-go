"use server";

import { redirect } from "next/navigation";
import { deleteRoom } from "@/services/room";

export async function removeRoom(roomId: number) {
    await deleteRoom(roomId);

    redirect("/admin/rooms");
}