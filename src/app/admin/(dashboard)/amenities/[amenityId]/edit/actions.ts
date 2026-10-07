"use server";

import { redirect } from "next/navigation";
import { getAmenityById, updateAmenity } from "@/services/amenity";
import { deleteImage, uploadImage } from "@/services/imageService";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/authorization";

export async function editAmenity(
    amenityId: number,
    formData: FormData
) {
    await requireAdmin();
    const amenity = await getAmenityById(amenityId);

    if (!amenity) {
        throw new Error("Amenity not found.");
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const timeDescription = formData.get(
        "timeDescription"
    ) as string;

    const image = formData.get("image") as File;

    if (!name || !description || !timeDescription) {
        throw new Error("All required fields must be filled.");
    }

    let imageUrl = amenity.image;

    if (image && image.size > 0) {
        const blob = await put(
            `amenities/${Date.now()}-${image.name}`,
            image,
            {
                access: "public",
                oidcToken: process.env.VERCEL_OIDC_TOKEN,
                storeId: process.env.BLOB_STORE_ID,
            }
        );

        imageUrl = await uploadImage("amenities", image);
        await deleteImage(amenity.image);
    }

    await updateAmenity(amenityId, {
        name,
        description,
        image: imageUrl,
        timeDescription,
    });

    redirect(`/admin/amenities/${amenityId}`);
}