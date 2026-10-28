"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/services/imageService";
import { getRoomById } from "@/services/room";
import { requireAdmin } from "@/lib/authorization";

export async function removeRoom(roomId: number) {
    const admin = await requireAdmin();

    if (!Number.isSafeInteger(roomId) || roomId < 1) {
        throw new Error("Invalid room ID.");
    }

    const existingRoom = await getRoomById(roomId);

    if (!existingRoom) {
        throw new Error("Room not found.");
    }

    await prisma.$transaction(async (tx) => {
        const room = await tx.room.delete({ where: { id: roomId }, });
        await tx.activityLog.create({
            data: {
                entity_type: "ROOM",
                entity_id: room.id,
                entity_name: room.name,
                action: "DELETED",
                actor_user_id: admin.userId,
                actor_type: "ADMIN",
                room_id: null,
                previous_data: {
                    name: room.name,
                    description: room.description,
                    price: room.price,
                    image: "Image",
                    maxGuests: room.maxGuests,
                    beds: room.beds,
                    bedType: room.bedType,
                    bedrooms: room.bedrooms,
                    bathrooms: room.bathrooms,
                    hasWifi: room.hasWifi,
                    hasParking: room.hasParking,
                    hasAC: room.hasAC,
                    hasKitchen: room.hasKitchen,
                    hasPrivatePool: room.hasPrivatePool,
                    checkInTime: room.checkInTime,
                    checkOutTime: room.checkOutTime,
                },
            },
        });
    });

    try {
        await deleteImage(existingRoom.image);
    } catch {
    }

    redirect("/admin/rooms");
}