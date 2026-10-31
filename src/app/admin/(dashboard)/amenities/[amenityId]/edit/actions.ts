"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getAmenityById } from "@/services/amenity";
import { uploadImage, deleteImage } from "@/services/imageService";
import { requireAdmin } from "@/lib/authorization";

export async function editAmenity(
    amenityId: number,
    formData: FormData
) {
    const admin = await requireAdmin();

    if (!Number.isSafeInteger(amenityId) || amenityId < 1) {
        throw new Error("Invalid amenity ID.");
    }

    const nameValue = formData.get("name");
    const descriptionValue = formData.get("description");
    const timeDescriptionValue = formData.get("timeDescription");
    const imageFile = formData.get("image");

    if (typeof nameValue !== "string" || !nameValue.trim() || typeof descriptionValue !== "string" || !descriptionValue.trim() || typeof timeDescriptionValue !== "string" || !timeDescriptionValue.trim()) {
        throw new Error("Please complete all required amenity fields.");
    }

    const existingAmenity = await getAmenityById(amenityId);

    if (!existingAmenity) {
        throw new Error("Amenity not found.");
    }

    const name = nameValue.trim();
    const description = descriptionValue.trim();
    const timeDescription = timeDescriptionValue.trim();
    let imageUrl = existingAmenity.image;
    let uploadedImageUrl: string | null = null;

    if (imageFile instanceof File && imageFile.size > 0) {
        if (!imageFile.type.startsWith("image/") || imageFile.size > 10 * 1024 * 1024) {
            throw new Error("Please upload a valid image no larger than 10 MB.");
        }
        uploadedImageUrl = await uploadImage("amenities", imageFile);
        imageUrl = uploadedImageUrl;
    } else if (imageFile !== null && !(imageFile instanceof File)) {
        throw new Error("Invalid amenity image.");
    }

    const previousData: Record<string, unknown> = {};
    const newData: Record<string, unknown> = {};

    const changes = {
        name: [existingAmenity.name, name],
        description: [existingAmenity.description, description],
        timeDescription: [existingAmenity.timeDescription, timeDescription],
    } as const;

    for (const [field, values] of Object.entries(changes)) {
        const [oldValue, newValue] = values;
        if (oldValue !== newValue) {
            previousData[field] = oldValue;
            newData[field] = newValue;
        }
    }
    if (uploadedImageUrl) {
        previousData.image = "Image";
        newData.image = "Image updated";
    }

    try {
        await prisma.$transaction(async (tx) => {
            const amenity = await tx.amenity.update({
                where: { id: amenityId },
                data: {
                    name,
                    description,
                    timeDescription,
                    image: imageUrl,
                },
            });

            if (Object.keys(newData).length > 0) {
                await tx.activityLog.create({
                    data: {
                        entity_type: "AMENITY",
                        entity_id: amenity.id,
                        entity_name: amenity.name,
                        action: "UPDATED",
                        actor_user_id: admin.userId,
                        actor_type: "ADMIN",
                        amenity_id: amenity.id,
                        previous_data: previousData as object,
                        new_data: newData as object,
                    },
                });
            }
        });
    } catch (error) {
        if (uploadedImageUrl) {
            try {
                await deleteImage(uploadedImageUrl);
            } catch {
            }
        }
        throw error;
    }

    if (uploadedImageUrl) {
        try {
            await deleteImage(existingAmenity.image);
        } catch {
        }
    }

    redirect(`/admin/amenities/${amenityId}`);
}