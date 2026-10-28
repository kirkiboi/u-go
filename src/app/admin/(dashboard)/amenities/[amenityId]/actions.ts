"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getAmenityById } from "@/services/amenity";
import { deleteImage } from "@/services/imageService";
import { requireAdmin } from "@/lib/authorization";

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