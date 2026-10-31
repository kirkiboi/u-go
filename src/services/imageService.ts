import { del, put } from "@vercel/blob";
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
};

async function validateImage(file: File): Promise<void> {
    if (!(file instanceof File) || file.size === 0) {
        throw new Error("Please upload a valid image.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    const expectedMimeType = extension ? ALLOWED_IMAGE_TYPES[extension] : undefined;

    if (!expectedMimeType || file.type !== expectedMimeType) {
        throw new Error("Only JPG and PNG images are allowed.");
    }
    const signature = new Uint8Array(await file.slice(0, 8).arrayBuffer());

    const isJpeg =
        signature[0] === 0xff &&
        signature[1] === 0xd8 &&
        signature[2] === 0xff;

    const isPng =
        signature[0] === 0x89 &&
        signature[1] === 0x50 &&
        signature[2] === 0x4e &&
        signature[3] === 0x47 &&
        signature[4] === 0x0d &&
        signature[5] === 0x0a &&
        signature[6] === 0x1a &&
        signature[7] === 0x0a;

    if ((expectedMimeType === "image/jpeg" && !isJpeg) || (expectedMimeType === "image/png" && !isPng)) {
        throw new Error("The uploaded file is not a valid JPG or PNG image.");
    }
}

export async function uploadImage(
    folder: "rooms" | "amenities",
    file: File
) {
    await validateImage(file);
    const blob = await put(`${folder}/${Date.now()}-${crypto.randomUUID()}.${file.name.split(".").pop()?.toLowerCase()}`,
        file,
        {
            access: "public",
            addRandomSuffix: true,
            contentType: file.type,
        }
    );

    return blob.url;
}

export async function deleteImage(imageUrl: string) {
    await del(imageUrl);
}