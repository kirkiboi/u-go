import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
    if (request.nextUrl.pathname === "/admin/login") {
        return NextResponse.next();
    }
    const sessionToken = request.cookies.get("ugo_admin_session")?.value;

    if (!sessionToken) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const secret = process.env.SESSION_SECRET;

    if (!secret) {
        console.error("SESSION_SECRET is not configured.");
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
        const secretKey = new TextEncoder().encode(secret);
        const { payload } = await jwtVerify(sessionToken, secretKey);
        if (payload.role !== "admin") {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
        return NextResponse.next();

    } catch {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }
}
export const config = {
    matcher: ["/admin/:path*"],
};