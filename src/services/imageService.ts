import { put } from "@vercel/blob";

export async function uploadRoomImage(file: File) {
    const blob = await put(
        `rooms/${Date.now()}-${file.name}`,
        file,
        {
            access: "public",
        }
    );

    return blob.url;
}