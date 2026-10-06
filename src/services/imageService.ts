import { put } from "@vercel/blob";

export async function uploadRoomImage(file: File) {
    const blob = await put(
        `rooms/${Date.now()}-${file.name}`,
        file,
        {
            access: "public",
            oidcToken: process.env.VERCEL_OIDC_TOKEN,
            storeId: process.env.BLOB_STORE_ID,
        }
    );

    return blob.url;
}