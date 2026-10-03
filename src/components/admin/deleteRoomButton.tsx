"use client";

import { useState, useTransition } from "react";
import { removeRoom } from "@/app/admin/(dashboard)/rooms/[roomId]/actions";
import ConfirmModal from "@/components/reusable/confirmModal";
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
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to delete room."
                );
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

            <ConfirmModal
                isOpen={isConfirming}
                title="Delete Room"
                description="Are you sure you want to delete this room? This action cannot be undone and will permanently remove all associated data and storage images."
                confirmLabel={isPending ? "Deleting..." : "Delete Room"}
                isPending={isPending}
                error={error}
                onCancel={() => {
                    setIsConfirming(false);
                    setError(null);
                }}
                onConfirm={handleDelete}
            />
        </>
    );
}