import type { NextRequest } from "next/server";
export function getClientIp(request: NextRequest): string | null {

    if (process.env.NODE_ENV === "development") {
        return "local-development";
    }

    const forwardedFor = request.headers.get("x-forwarded-for");

    if (forwardedFor) {
        const clientIp = forwardedFor.split(",")[0]?.trim();
        if (clientIp) {
            return clientIp;
        }
    }

    const realIp = request.headers.get("x-real-ip")?.trim();
    return realIp || null;
}