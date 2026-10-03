"use client";

import Link from "next/link";
import { useState } from "react";

export default function CancelEditButton({
    roomId,
}: {
    roomId: number;
}) {
    const [isConfirming, setIsConfirming] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsConfirming(true)}
                className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white hover:text-black cursor-pointer"
                style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-forest-800)",
                }}>
                Cancel
            </button>

            {isConfirming && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <h3
                            className="text-lg font-bold"
                            style={{ color: "white" }}>
                            Discard Changes
                        </h3>
                        <p
                            className="mt-2 text-sm"
                            style={{ color: "white" }}>
                            Are you sure you want to go back? Any changes you
                            made will be discarded.
                        </p>
                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsConfirming(false)}
                                className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors text-white hover:bg-white hover:text-black cursor-pointer"
                                style={{
                                    borderColor: "var(--color-border)",
                                }}>
                                Keep Editing
                            </button>
                            <Link
                                href={`/admin/rooms/${roomId}`}
                                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 cursor-pointer"
                                style={{
                                    backgroundColor:
                                        "var(--color-forest-700)",
                                }}>
                                Discard Changes
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}