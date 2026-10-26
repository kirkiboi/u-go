import { prisma } from "@/lib/prisma";
import { getSession } from "./sessions";

export async function requireAdmin() {
    const session = await getSession();

    if (!session) {
        throw new Error("Unauthorized.");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.userId,
        },
        select: {
            id: true,
            email: true,
            role: true,
        },
    });

    if (!user) {
        throw new Error("Unauthorized.");
    }
    if (user.role !== "admin") {
        throw new Error("Forbidden.");
    }
    return {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
}