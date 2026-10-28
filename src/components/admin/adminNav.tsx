"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/(auth)/logout/actions";
import { useState } from "react";
import ConfirmationModal from "@/components/reusable/ConfirmationModal";

const NAV_LINKS = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Rooms", href: "/admin/rooms" },
    { label: "Amenities", href: "/admin/amenities" },
    { label: "Bookings", href: "/admin/bookings" },
    { label: "Activity Logs", href: "/admin/activities" },
] as const;

export default function AdminNavbar() {
    const pathname = usePathname();
    const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);
    return (
        <aside
            className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r"
            style={{
                backgroundColor: "var(--color-forest-900)",
                borderColor: "var(--color-forest-800)",
            }}>
            <div className="border-b px-6 py-6"
                style={{
                    borderColor: "var(--color-forest-800)",
                }}>
                <span
                    className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                    style={{
                        color: "var(--color-forest-300)",
                    }}>
                    U-GO CLIFF RESORT
                </span>
                <span
                    className="mt-1 block text-xl font-bold"
                    style={{
                        fontFamily: "var(--font-display)",
                        color: "white",
                    }}>
                    Admin Portal
                </span>
            </div>

            <nav
                aria-label="Admin navigation"
                className="flex-1 px-4 py-6">
                <div className="space-y-1">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200"
                                style={{
                                    backgroundColor: isActive
                                        ? "var(--color-forest-700)"
                                        : "transparent",
                                    color: isActive
                                        ? "white"
                                        : "var(--color-forest-200)",
                                }}>
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div
                className="border-t p-4"
                style={{
                    borderColor: "var(--color-forest-800)",
                }}>
                <div
                    className="rounded-lg px-3 py-3"
                    style={{
                        backgroundColor: "var(--color-forest-800)",
                    }}>
                    <p
                        className="text-xs font-medium"
                        style={{
                            color: "var(--color-forest-200)",
                        }}>
                        Admin Account
                    </p>
                    <p
                        className="mt-1 text-xs"
                        style={{
                            color: "var(--color-forest-400)",
                        }}>
                        Administrator
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsConfirmingLogout(true)}
                    className="mt-3 w-full cursor-pointer rounded-md border px-3 py-2 text-xs font-medium transition-colors hover:bg-white/10"
                    style={{
                        borderColor: "var(--color-forest-700)",
                        color: "var(--color-forest-200)",
                    }}>
                    Sign out
                </button>

                <ConfirmationModal
                    isOpen={isConfirmingLogout}
                    title="Confirm Logout"
                    description="Are you sure you want to sign out of the admin portal?"
                    confirmLabel="Sign Out"
                    cancelLabel="Stay Logged In"
                    confirmPosition="right"
                    onCancel={() => setIsConfirmingLogout(false)}
                    onConfirm={async () => {
                        await logout();
                    }}
                />
            </div>
        </aside>
    );
}