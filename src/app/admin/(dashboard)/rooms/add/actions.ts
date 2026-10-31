"use server";

import { uploadImage, deleteImage } from "@/services/imageService";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";
import { normalizeTime } from "@/lib/time";
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

export async function addRoom(formData: FormData) {
    const admin = await requireAdmin();

    const name = getRequiredString(formData, "name");
    const description = getRequiredString(formData, "description");
    const checkInTime = normalizeTime(getRequiredString(formData, "checkInTime"));
    const checkOutTime = normalizeTime(getRequiredString(formData, "checkOutTime"));
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

    if (bedTypeValue !== null && typeof bedTypeValue !== "string") {
        throw new Error("Invalid bed type.");
    }

    const bedType =
        typeof bedTypeValue === "string" && bedTypeValue.trim()
            ? bedTypeValue.trim()
            : null;

    const imageFile = formData.get("image");

    if (
        !(imageFile instanceof File) ||
        imageFile.size === 0 ||
        !imageFile.type.startsWith("image/")
    ) {
        throw new Error("Please upload a valid room image.");
    }
    const imageUrl = await uploadImage("rooms", imageFile);
    try {
        await prisma.$transaction(async (tx) => {
            const room = await tx.room.create({
                data: {
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
                },
            });

            await tx.activityLog.create({
                data: {
                    entity_type: "ROOM",
                    entity_id: room.id,
                    entity_name: room.name,
                    action: "CREATED",
                    actor_user_id: admin.userId,
                    actor_type: "ADMIN",
                    room_id: room.id,
                    new_data: {
                        name: room.name,
                        description: room.description,
                        price: room.price,
                        image: "Image",
                        maxGuests: room.maxGuests,
                        beds: room.beds,
                        bedType: room.bedType,
                        bedrooms: room.bedrooms,
                        bathrooms: room.bathrooms,
                        hasWifi: room.hasWifi,
                        hasParking: room.hasParking,
                        hasAC: room.hasAC,
                        hasKitchen: room.hasKitchen,
                        hasPrivatePool: room.hasPrivatePool,
                        checkInTime: room.checkInTime,
                        checkOutTime: room.checkOutTime,
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
    redirect("/admin/rooms");
}