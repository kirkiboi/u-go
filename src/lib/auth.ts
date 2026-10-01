import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export async function verifyAdminCredentials(
    email: string,
    password: string
) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    };
}