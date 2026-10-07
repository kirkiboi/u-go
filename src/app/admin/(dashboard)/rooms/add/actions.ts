"use server";

import { uploadImage } from "@/services/imageService";
import { redirect } from "next/navigation";
import { createRoom } from "@/services/room";
import { requireAdmin } from "@/lib/authorization";

export async function addRoom(formData: FormData) {
    await requireAdmin();
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
    const maxGuestsNumber = Number(maxGuests);
    const bedsNumber = Number(beds);
    const bathroomsNumber = Number(bathrooms);
    const bedroomsNumber =
        typeof bedrooms === "string" && bedrooms.trim()
            ? Number(bedrooms)
            : undefined;
    if (
        !Number.isInteger(maxGuestsNumber) ||
        maxGuestsNumber < 1 ||
        !Number.isInteger(bedsNumber) ||
        bedsNumber < 1 ||
        !Number.isInteger(bathroomsNumber) ||
        bathroomsNumber < 1 ||
        (bedroomsNumber !== undefined &&
            (!Number.isInteger(bedroomsNumber) || bedroomsNumber < 1))
    ) {
        throw new Error("Invalid numeric values.");
    }
    const imageUrl = await uploadImage("rooms", imageFile);
    await createRoom({
        name,
        description,
        price,
        image: imageUrl,
        maxGuests: maxGuestsNumber,
        beds: bedsNumber,
        bedType:
            typeof bedType === "string" && bedType.trim()
                ? bedType
                : undefined,
        bedrooms: bedroomsNumber,
        bathrooms: bathroomsNumber,
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