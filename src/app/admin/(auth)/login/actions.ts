"use server";

import { verifyAdminCredentials } from "@/lib/auth";
import { createSession } from "@/lib/sessions";

export async function login(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
        return {
            success: false,
            error: "Please provide an email and password.",
        };
    }

    const user = await verifyAdminCredentials(email, password);

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