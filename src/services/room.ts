import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function getRooms(page: number = 1, pageSize: number = 4) {
    const totalRooms = await prisma.room.count();
    const totalPages = Math.ceil(totalRooms / pageSize);
    const currentPage = Math.min(
        Math.max(1, Math.floor(page) || 1),
        Math.max(1, totalPages)
    );

    const rooms = await prisma.room.findMany({
        orderBy: {
            id: "asc",
        },
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
    });

    return {
        rooms,
        totalRooms,
        totalPages,
        currentPage,
    };
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