"use client";

import { useState } from "react";

const sampleNotifications = [
    {
        id: 1,
        title: "New booking received",
        description: "A guest has submitted a new booking.",
        time: "Just now",
        unread: true,
    },
    {
        id: 2,
        title: "Payment received",
        description: "A booking payment has been completed.",
        time: "5 minutes ago",
        unread: true,
    },
    {
        id: 3,
        title: "Booking confirmed",
        description: "A guest booking has been confirmed.",
        time: "1 hour ago",
        unread: false,
    },
];

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = sampleNotifications.filter((notification) => notification.unread).length;

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Notifications"
                aria-expanded={isOpen}
                className="relative flex h-11 w-11 items-center justify-center rounded-xl border bg-white transition-colors hover: cursor-pointer bg-gray-50"
                style={{ borderColor: "var(--color-border)" }}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "var(--color-forest-900)" }}>
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M10 21h4" />
                </svg>

                {unreadCount > 0 && (<span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />)}
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-xl border bg-white shadow-lg sm:w-96"
                    style={{ borderColor: "var(--color-border)" }}>
                    <div
                        className="flex items-center justify-between border-b px-4 py-3"
                        style={{ borderColor: "var(--color-border)" }}>
                        <h2
                            className="text-sm font-semibold"
                            style={{ color: "var(--color-forest-900)" }}>
                            Notifications
                        </h2>

                        {unreadCount > 0 && (
                            <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                                {unreadCount} unread
                            </span>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {sampleNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`flex gap-3 border-b px-4 py-4 last:border-b-0 ${notification.unread ? "bg-forest-50/40" : "bg-white"
                                    }`}
                                style={{
                                    borderColor: "var(--color-border)",
                                }}>
                                <div
                                    className="mt-1 h-2 w-2 shrink-0 rounded-full"
                                    style={{
                                        backgroundColor: notification.unread ? "var(--color-forest-600)" : "transparent",
                                    }}
                                />

                                <div className="min-w-0 flex-1">
                                    <p
                                        className="text-sm font-medium"
                                        style={{
                                            color: "var(--color-forest-900)",
                                        }}>
                                        {notification.title}
                                    </p>

                                    <p
                                        className="mt-1 text-xs leading-relaxed"
                                        style={{
                                            color: "var(--color-muted)",
                                        }}>
                                        {notification.description}
                                    </p>

                                    <p
                                        className="mt-2 text-xs"
                                        style={{
                                            color: "var(--color-muted)",
                                        }}>
                                        {notification.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        className="border-t px-4 py-3 text-center"
                        style={{ borderColor: "var(--color-border)" }}>
                        <p
                            className="text-xs"
                            style={{ color: "var(--color-muted)" }}>
                            Notification functionality coming soon
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}