"use server";

import { verifyAdminCredentials } from "@/lib/auth";
import { createSession } from "@/lib/sessions";
import { adminLoginRateLimit } from "@/lib/rateLimit";

export async function login(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
        return {
            success: false,
            error: "Please provide an email and password.",
        };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const { success } = await adminLoginRateLimit.limit(normalizedEmail);
    if (!success) {
        return {
            success: false,
            error: "Too many login attempts. Please try again later.",
        };
    }
    const user = await verifyAdminCredentials(normalizedEmail, password);

    if (!user) {
        return {
            success: false,
            error: "Invalid email or password.",
        };
    }
    await createSession(user);
    return {
        success: true,
        user,
    };
}