"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { uploadImage, deleteImage } from "@/services/imageService";
import { requireAdmin } from "@/lib/authorization";

export async function addAmenity(formData: FormData) {
    const admin = await requireAdmin();
    const nameValue = formData.get("name");
    const descriptionValue = formData.get("description");
    const timeDescriptionValue = formData.get("timeDescription");
    const imageFile = formData.get("image");

    if (typeof nameValue !== "string" || !nameValue.trim() || typeof descriptionValue !== "string" || !descriptionValue.trim() || typeof timeDescriptionValue !== "string" || !timeDescriptionValue.trim()) {
        throw new Error("Please complete all required amenity fields.");
    }

    if (!(imageFile instanceof File) || imageFile.size === 0 || !imageFile.type.startsWith("image/") || imageFile.size > 10 * 1024 * 1024) {
        throw new Error("Please upload a valid image no larger than 10 MB.");
    }
    const name = nameValue.trim();
    const description = descriptionValue.trim();
    const timeDescription = timeDescriptionValue.trim();

    const imageUrl = await uploadImage("amenities", imageFile);

    try {
        await prisma.$transaction(async (tx) => {
            const amenity = await tx.amenity.create({
                data: {
                    name,
                    description,
                    timeDescription,
                    image: imageUrl,
                },
            });

            await tx.activityLog.create({
                data: {
                    entity_type: "AMENITY",
                    entity_id: amenity.id,
                    entity_name: amenity.name,
                    action: "CREATED",
                    actor_user_id: admin.userId,
                    actor_type: "ADMIN",
                    amenity_id: amenity.id,
                    new_data: {
                        name: amenity.name,
                        description: amenity.description,
                        timeDescription: amenity.timeDescription,
                        image: "Image",
                    },
                },
            });
        });
    } catch (error) {
        try {
            await deleteImage(imageUrl);
        } catch {
        }

        throw error;
    }

    redirect("/admin/amenities");
}