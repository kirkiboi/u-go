"use server";

import { destroySession } from "@/lib/sessions";
import { redirect } from "next/navigation";

export async function logout() {
    await destroySession();
    redirect("/admin/login");
}