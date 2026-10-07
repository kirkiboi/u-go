import { getSession } from "./sessions";

export async function requireAdmin() {
    const session = await getSession();

    if (!session) {
        throw new Error("Unauthorized.");
    }

    if (session.role !== "admin") {
        throw new Error("Forbidden.");
    }

    return session;
}