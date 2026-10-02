import { prisma } from "@/lib/prisma";

export async function getRooms() {
    return prisma.room.findMany({
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

export async function createRoom(data: {
    name: string;
    description: string;
    price: string;
    image: string;
    maxGuests: number;
    rooms?: number;
    beds: number;
    bedType?: string;
    bedrooms?: number;
    bathrooms: number;
    hasPrivatePool: boolean;
    hasKitchen: boolean;
    hasWifi: boolean;
    hasParking: boolean;
    hasAC: boolean;
    checkInTime: string;
    checkOutTime: string;
}) {
    return prisma.room.create({
        data,
    });
}

export async function updateRoom(
    id: number,
    data: {
        name: string;
        description: string;
        price: string;
        image: string;
        maxGuests: number;
        rooms?: number;
        beds: number;
        bedType?: string;
        bedrooms?: number;
        bathrooms: number;
        hasPrivatePool: boolean;
        hasKitchen: boolean;
        hasWifi: boolean;
        hasParking: boolean;
        hasAC: boolean;
        checkInTime: string;
        checkOutTime: string;
    }
) {
    return prisma.room.update({
        where: {
            id,
        },
        data,
    });
}