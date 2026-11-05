"use client";

import { useState, useTransition } from "react";
import { restoreRoom } from "@/app/admin/(dashboard)/rooms/[roomId]/actions";
import ConfirmModal from "@/components/reusable/confirmModal";

export default function RestoreRoomButton({
    roomId,
}: {
    roomId: number;
}) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleRestore = () => {
        setError(null);

        startTransition(async () => {
            try {
                await restoreRoom(roomId);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to restore room.");
            }
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsConfirming(true)}
                className="rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-50 hover:cursor-pointer"
                style={{
                    borderColor: "var(--color-forest-600)",
                    color: "var(--color-forest-700)",
                }}>
                Unarchive
            </button>

            <ConfirmModal
                isOpen={isConfirming}
                title="Unarchive Room"
                description="Are you sure you want to unarchive this room? It will become visible in public room listings and available for new bookings again."
                confirmLabel={isPending ? "Unarchiving..." : "Unarchive Room"}
                isPending={isPending}
                error={error}
                onCancel={() => {
                    setIsConfirming(false);
                    setError(null);
                }}
                onConfirm={handleRestore}
            />
        </>
    );
}