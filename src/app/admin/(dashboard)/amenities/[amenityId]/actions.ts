"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getAmenityById } from "@/services/amenity";
import { deleteImage } from "@/services/imageService";
import { requireAdmin } from "@/lib/authorization";
import { Prisma } from "@prisma/client";

export async function removeAmenity(amenityId: number) {
    const admin = await requireAdmin();
    if (!Number.isSafeInteger(amenityId) || amenityId < 1) {
        throw new Error("Invalid amenity ID.");
    }
    const existingAmenity = await getAmenityById(amenityId);

    if (!existingAmenity) {
        throw new Error("Amenity not found.");
    }

    await prisma.$transaction(async (tx) => {
        const amenity = await tx.amenity.delete({
            where: { id: amenityId },
        });

        await tx.activityLog.create({
            data: {
                entity_type: "AMENITY",
                entity_id: amenity.id,
                entity_name: amenity.name,
                action: "DELETED",
                actor_user_id: admin.userId,
                actor_type: "ADMIN",
                amenity_id: null,
                previous_data: {
                    name: amenity.name,
                    description: amenity.description,
                    timeDescription: amenity.timeDescription,
                    image: "Image",
                },
            },
        });
    });

    try {
        await deleteImage(existingAmenity.image);
    } catch {
    }

    redirect("/admin/amenities");
}
export async function archiveAmenity(amenityId: number) {
    const admin = await requireAdmin();

    if (!Number.isSafeInteger(amenityId) || amenityId < 1) {
        throw new Error("Invalid amenity ID.");
    }

    const existingAmenity = await getAmenityById(amenityId);

    if (!existingAmenity) {
        throw new Error("Amenity not found.");
    }

    if (existingAmenity.isArchived) {
        throw new Error("This amenity is already archived.");
    }

    await prisma.$transaction(
        async (tx) => {
            const result = await tx.amenity.updateMany({
                where: {
                    id: amenityId,
                    isArchived: false,
                },
                data: {
                    isArchived: true,
                },
            });

            if (result.count !== 1) {
                throw new Error("This amenity is no longer active or has already been archived.");
            }

            await tx.activityLog.create({
                data: {
                    entity_type: "AMENITY",
                    entity_id: amenityId,
                    entity_name: existingAmenity.name,
                    action: "ARCHIVED",
                    actor_user_id: admin.userId,
                    actor_type: "ADMIN",
                    amenity_id: amenityId,
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

    redirect("/admin/amenities");
}

export async function restoreAmenity(amenityId: number) {
    const admin = await requireAdmin();

    if (!Number.isSafeInteger(amenityId) || amenityId < 1) {
        throw new Error("Invalid amenity ID.");
    }

    const existingAmenity = await getAmenityById(amenityId);

    if (!existingAmenity) {
        throw new Error("Amenity not found.");
    }

    if (!existingAmenity.isArchived) {
        throw new Error("This amenity is not archived.");
    }

    await prisma.$transaction(
        async (tx) => {
            const result = await tx.amenity.updateMany({
                where: {
                    id: amenityId,
                    isArchived: true,
                },
                data: {
                    isArchived: false,
                },
            });

            if (result.count !== 1) {
                throw new Error("This amenity is no longer archived or has already been restored.");
            }

            await tx.activityLog.create({
                data: {
                    entity_type: "AMENITY",
                    entity_id: amenityId,
                    entity_name: existingAmenity.name,
                    action: "RESTORED",
                    actor_user_id: admin.userId,
                    actor_type: "ADMIN",
                    amenity_id: amenityId,
                    previous_data: {
                        isArchived: true,
                    },
                    new_data: {
                        isArchived: false,
                    },
                },
            });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, }
    );

    redirect("/admin/amenities");
}