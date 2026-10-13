"use server";

import { redirect } from "next/navigation";
import { getRoomById, updateRoom } from "@/services/room";
import { uploadImage, deleteImage } from "@/services/imageService";
import { requireAdmin } from "@/lib/authorization";

function getRequiredString(
    formData: FormData,
    field: string
): string {
    const value = formData.get(field);
    if (typeof value !== "string" || !value.trim()) {
        throw new Error(`Please provide a valid ${field}.`);
    }
    return value.trim();
}

function getRequiredPositiveInteger(
    value: string,
    field: string
): number {
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number < 1) {
        throw new Error(`${field} must be a positive whole number.`);
    }
    return number;
}

function getOptionalNonNegativeInteger(
    formData: FormData,
    field: string
): number | null {
    const value = formData.get(field);

    if (value === null || value === "") {
        return null;
    }

    if (typeof value !== "string") {
        throw new Error(`Invalid ${field}.`);
    }
    const number = Number(value);

    if (!Number.isSafeInteger(number) || number < 0) {
        throw new Error(
            `${field} must be zero or a positive whole number.`
        );
    }
    return number;
}

export async function editRoom(
    roomId: number,
    formData: FormData
) {
    await requireAdmin();

    const name = getRequiredString(formData, "name");
    const description = getRequiredString(formData, "description");
    const checkInTime = getRequiredString(formData, "checkInTime");
    const checkOutTime = getRequiredString(formData, "checkOutTime");
    const price = getRequiredPositiveInteger(
        getRequiredString(formData, "price"),
        "Price"
    );
    const maxGuests = getRequiredPositiveInteger(
        getRequiredString(formData, "maxGuests"),
        "Maximum guests"
    );
    const beds = getRequiredPositiveInteger(
        getRequiredString(formData, "beds"),
        "Number of beds"
    );
    const bedrooms = getOptionalNonNegativeInteger(
        formData,
        "bedrooms"
    );
    const bathrooms = getOptionalNonNegativeInteger(
        formData,
        "bathrooms"
    );
    const bedTypeValue = formData.get("bedType");
    if (
        bedTypeValue !== null &&
        typeof bedTypeValue !== "string"
    ) {
        throw new Error("Invalid bed type.");
    }

    const bedType =
        typeof bedTypeValue === "string" && bedTypeValue.trim()
            ? bedTypeValue.trim()
            : null;

    const existingRoom = await getRoomById(roomId);

    if (!existingRoom) {
        throw new Error("Room not found.");
    }
    const imageFile = formData.get("image");
    let imageUrl = existingRoom.image;
    let uploadedImageUrl: string | null = null;
    if (imageFile instanceof File && imageFile.size > 0) {
        if (!imageFile.type.startsWith("image/")) {
            throw new Error("Please upload a valid room image.");
        }

        uploadedImageUrl = await uploadImage("rooms", imageFile);
        imageUrl = uploadedImageUrl;
    } else if (
        imageFile !== null &&
        !(imageFile instanceof File)
    ) {
        throw new Error("Invalid room image.");
    }
    try {
        await updateRoom(roomId, {
            name,
            description,
            price,
            image: imageUrl,
            maxGuests,
            beds,
            bedType,
            bedrooms,
            bathrooms,
            hasWifi: formData.get("hasWifi") === "on",
            hasParking: formData.get("hasParking") === "on",
            hasAC: formData.get("hasAC") === "on",
            hasKitchen: formData.get("hasKitchen") === "on",
            hasPrivatePool: formData.get("hasPrivatePool") === "on",
            checkInTime,
            checkOutTime,
        });
    } catch (error) {
        if (uploadedImageUrl) {
            await deleteImage(uploadedImageUrl).catch(() => { });
        }
        throw error;
    }
    if (uploadedImageUrl) {
        await deleteImage(existingRoom.image).catch(() => { });
    }
    redirect(`/admin/rooms/${roomId}`);
}