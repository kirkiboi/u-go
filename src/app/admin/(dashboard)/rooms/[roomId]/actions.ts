"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
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

    try {
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
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && (error.code === "P2003" || error.code === "P2014")) {
            throw new Error("Cannot delete this room because it has existing bookings.");
        }

        if (error instanceof Error && error.message.includes("Booking_room_id_fkey")) {
            throw new Error("Cannot delete this room because it has existing bookings.");
        }
        throw error;
    }
    redirect("/admin/rooms");
}

export async function archiveRoom(roomId: number) {
    const admin = await requireAdmin();

    if (!Number.isSafeInteger(roomId) || roomId < 1) {
        throw new Error("Invalid room ID.");
    }

    const existingRoom = await getRoomById(roomId);

    if (!existingRoom) {
        throw new Error("Room not found.");
    }

    if (existingRoom.isArchived) {
        throw new Error("This room is already archived.");
    }

    await prisma.$transaction(
        async (tx) => {
            const result = await tx.room.updateMany({
                where: {
                    id: roomId,
                    isArchived: false,
                },
                data: {
                    isArchived: true,
                },
            });
            if (result.count !== 1) {
                throw new Error("This room is no longer active or has already been archived.");
            }

            await tx.activityLog.create({
                data: {
                    entity_type: "ROOM",
                    entity_id: roomId,
                    entity_name: existingRoom.name,
                    action: "ARCHIVED",
                    actor_user_id: admin.userId,
                    actor_type: "ADMIN",
                    room_id: roomId,
                    previous_data: {
                        isArchived: false,
                    },
                    new_data: {
                        isArchived: true,
                    },
                },
            });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, }
    );

    redirect("/admin/rooms");
}

export async function restoreRoom(roomId: number) {
    const admin = await requireAdmin();

    if (!Number.isSafeInteger(roomId) || roomId < 1) {
        throw new Error("Invalid room ID.");
    }

    const existingRoom = await getRoomById(roomId);

    if (!existingRoom) {
        throw new Error("Room not found.");
    }

    if (!existingRoom.isArchived) {
        throw new Error("This room is not archived.");
    }

    await prisma.$transaction(async (tx) => {
        const room = await tx.room.update({
            where: { id: roomId },
            data: { isArchived: false },
        });

        await tx.activityLog.create({
            data: {
                entity_type: "ROOM",
                entity_id: room.id,
                entity_name: room.name,
                action: "RESTORED",
                actor_user_id: admin.userId,
                actor_type: "ADMIN",
                room_id: room.id,
                previous_data: {
                    isArchived: true,
                },
                new_data: {
                    isArchived: false,
                },
            },
        });
    });
    redirect("/admin/rooms");
}
