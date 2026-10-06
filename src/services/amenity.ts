import { prisma } from "@/lib/prisma";

export async function getAmenities() {
    return prisma.amenity.findMany({
        orderBy: {
            id: "asc",
        },
    });
}

export async function getAmenityById(id: number) {
    return prisma.amenity.findUnique({
        where: {
            id,
        },
    });
}

export async function createAmenity(data: {
    name: string;
    description: string;
    image: string;
    timeDescription: string;
}) {
    return prisma.amenity.create({
        data,
    });
}

export async function updateAmenity(
    id: number,
    data: {
        name: string;
        description: string;
        image: string;
        timeDescription: string;
    }
) {
    return prisma.amenity.update({
        where: {
            id,
        },
        data,
    });
}

export async function deleteAmenity(id: number) {
    return prisma.amenity.delete({
        where: {
            id,
        },
    });
}