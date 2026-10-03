"use client";

import { useState, useTransition } from "react";
import { removeRoom } from "@/app/admin/(dashboard)/rooms/[roomId]/actions";

export default function DeleteRoomButton({
    roomId,
}: {
    roomId: number;
}) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleDelete = () => {
        setError(null);
        startTransition(async () => {
            try {
                await removeRoom(roomId);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to delete room.");
            }
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsConfirming(true)}
                className="rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 cursor-pointer"
                style={{
                    borderColor: "#b91c1c",
                    color: "#b91c1c",
                }}>
                Delete Room
            </button>

            {isConfirming && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <h3
                            className="text-lg font-bold"
                            style={{ color: "white" }}>
                            Delete Room
                        </h3>

                        <p
                            className="mt-2 text-sm"
                            style={{ color: "white" }}>
                            Are you sure you want to delete this room? This action cannot be undone and will permanently remove all associated data and storage images.
                        </p>

                        {error && (
                            <p className="mt-3 text-xs font-medium text-red-600">
                                {error}
                            </p>
                        )}

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => {
                                    setIsConfirming(false);
                                    setError(null);
                                }}
                                className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors text-white hover:bg-white hover:text-black disabled:opacity-50 cursor-pointer"
                                style={{
                                    borderColor: "var(--color-border)",
                                }}>
                                Cancel
                            </button>


                            <button
                                type="button"
                                disabled={isPending}
                                onClick={handleDelete}
                                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50 cursor-pointer"
                                style={{
                                    backgroundColor: "#b91c1c",
                                }}>
                                {isPending ? "Deleting..." : "Delete Room"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}