"use server";

import { redirect } from "next/navigation";
import { deleteAmenity, getAmenityById } from "@/services/amenity";
import { deleteImage } from "@/services/imageService";
import { requireAdmin } from "@/lib/authorization";

export async function removeAmenity(amenityId: number) {
    await requireAdmin();
    const amenity = await getAmenityById(amenityId);

    if (!amenity) {
        throw new Error("Amenity not found.");
    }

    await deleteImage(amenity.image);
    await deleteAmenity(amenityId);

    redirect("/admin/amenities");
}