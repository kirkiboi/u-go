"use server";

import { headers } from "next/headers";
import { verifyAdminCredentials } from "@/lib/auth";
import { createSession } from "@/lib/sessions";
import {
    adminLoginRateLimit,
    adminLoginIpRateLimit,
} from "@/lib/rateLimit";
import { getClientIpFromHeaders } from "@/lib/clientIP";

export async function login(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
    ) {
        return {
            success: false,
            error: "Please provide an email and password.",
        };
    }
    const requestHeaders = await headers();
    const clientIp = getClientIpFromHeaders(requestHeaders);
    if (!clientIp) {
        return {
            success: false,
            error: "Unable to verify your connection. Please try again later.",
        };
    }
    const ipLimit = await adminLoginIpRateLimit.limit(clientIp);
    if (!ipLimit.success) {
        return {
            success: false,
            error: "Too many login attempts. Please try again later.",
        };
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailLimit = await adminLoginRateLimit.limit(normalizedEmail);

    if (!emailLimit.success) {
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