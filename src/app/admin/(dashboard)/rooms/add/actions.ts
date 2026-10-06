"use server";

import { uploadImage } from "@/services/imageService";
import { redirect } from "next/navigation";
import { createRoom } from "@/services/room";

export async function addRoom(formData: FormData) {
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const imageFile = formData.get("image");
    const maxGuests = formData.get("maxGuests");
    const beds = formData.get("beds");
    const bedType = formData.get("bedType");
    const bedrooms = formData.get("bedrooms");
    const bathrooms = formData.get("bathrooms");
    const checkInTime = formData.get("checkInTime");
    const checkOutTime = formData.get("checkOutTime");

    if (
        typeof name !== "string" ||
        typeof description !== "string" ||
        typeof price !== "string" ||
        !(imageFile instanceof File) ||
        imageFile.size === 0 ||
        typeof maxGuests !== "string" ||
        typeof beds !== "string" ||
        typeof bathrooms !== "string" ||
        typeof checkInTime !== "string" ||
        typeof checkOutTime !== "string"
    ) {
        throw new Error("Invalid inputs.");
    }
    const imageUrl = await uploadImage("rooms", imageFile);
    await createRoom({
        name,
        description,
        price,
        image: imageUrl,
        maxGuests: Number(maxGuests),
        beds: Number(beds),
        bedType:
            typeof bedType === "string" && bedType.trim()
                ? bedType
                : undefined,
        bedrooms:
            typeof bedrooms === "string" && bedrooms.trim()
                ? Number(bedrooms)
                : undefined,
        bathrooms: Number(bathrooms),
        hasWifi: formData.get("hasWifi") === "on",
        hasParking: formData.get("hasParking") === "on",
        hasAC: formData.get("hasAC") === "on",
        hasKitchen: formData.get("hasKitchen") === "on",
        hasPrivatePool: formData.get("hasPrivatePool") === "on",
        checkInTime,
        checkOutTime,
    });

    redirect("/admin/rooms");
}