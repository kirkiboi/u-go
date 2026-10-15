
import type { NextRequest } from "next/server";
export function getClientIp(request: NextRequest): string | null {
    // local development
    if (process.env.NODE_ENV === "development") {
        return "local-development";
    }
    // prod.
    const clientIp = request.headers.get("x-real-ip")?.trim();
    return clientIp || null;
}