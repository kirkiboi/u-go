import { del, put } from "@vercel/blob";

export async function uploadImage(
    folder: "rooms" | "amenities",
    file: File
) {
    const blob = await put(
        `${folder}/${Date.now()}-${file.name}`,
        file,
        {
            access: "public",
            oidcToken: process.env.VERCEL_OIDC_TOKEN,
            storeId: process.env.BLOB_STORE_ID,
        }
    );

    return blob.url;
}

export async function deleteImage(imageUrl: string) {
    await del(imageUrl, {
        oidcToken: process.env.VERCEL_OIDC_TOKEN,
        storeId: process.env.BLOB_STORE_ID,
    });
}