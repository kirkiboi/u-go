"use server";

import { redirect } from "next/navigation";
import { createAmenity } from "@/services/amenity";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/authorization";

export async function addAmenity(formData: FormData) {
    await requireAdmin();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const timeDescription = formData.get("timeDescription") as string;
    const image = formData.get("image") as File;

    if (!name || !description || !timeDescription || !image) {
        throw new Error("All fields are required.");
    }

    const blob = await put(
        `amenities/${Date.now()}-${image.name}`,
        image,
        {
            access: "public",
        }
    );

    await createAmenity({
        name,
        description,
        image: blob.url,
        timeDescription,
    });

    redirect("/admin/amenities");
}