import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";


export async function getRooms() {
    return prisma.room.findMany({
        where: {
            isArchived: false,
        },
        orderBy: {
            id: "asc",
        },
    });
}

export async function getArchivedRooms() {
    return prisma.room.findMany({
        where: {
            isArchived: true,
        },
        orderBy: {
            id: "asc",
        },
    });
}

export async function getRoomById(id: number) {
    return prisma.room.findUnique({
        where: {
            id,
        },
    });
}

export async function createRoom(
    data: Prisma.RoomUncheckedCreateInput
) {
    return prisma.room.create({
        data,
    });
}

export async function updateRoom(
    id: number,
    data: Prisma.RoomUncheckedUpdateInput
) {
    return prisma.room.update({
        where: {
            id,
        },
        data,
    });
}

export async function deleteRoom(id: number) {
    return prisma.room.delete({
        where: {
            id,
        },
    });
}