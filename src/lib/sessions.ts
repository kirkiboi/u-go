import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "ugo_admin_session";
const secret = process.env.SESSION_SECRET;

if (!secret) {
    throw new Error("SESSION_SECRET is not configured.");
}

const SESSION_SECRET = new TextEncoder().encode(secret);

type SessionPayload = {
    userId: number;
    email: string;
    role: string;
};

export async function createSession(user: {
    id: number;
    email: string;
    role: string;
}) {
    const token = await new SignJWT({
        userId: user.id,
        email: user.email,
        role: user.role,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("8h")
        .sign(SESSION_SECRET);

    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
    });
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(token, SESSION_SECRET);

        if (
            typeof payload.userId !== "number" ||
            typeof payload.email !== "string" ||
            typeof payload.role !== "string"
        ) {
            return null;
        }

        return {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        };
    } catch {
        return null;
    }
}

export async function destroySession() {
    const cookieStore = await cookies();

    cookieStore.delete(SESSION_COOKIE);
}