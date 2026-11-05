"use client";

import { useState, useTransition } from "react";
import { archiveRoom } from "@/app/admin/(dashboard)/rooms/[roomId]/actions";
import ConfirmModal from "@/components/reusable/confirmModal";

export default function ArchiveRoomButton({
    roomId,
}: {
    roomId: number;
}) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleArchive = () => {
        setError(null);

        startTransition(async () => {
            try {
                await archiveRoom(roomId);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to archive room.");
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
                    borderColor: "var(--color-border)",
                    color: "var(--color-forest-700)",
                }}>
                Archive Room
            </button>

            <ConfirmModal
                isOpen={isConfirming}
                title="Archive Room"
                description="Are you sure you want to archive this room? It will be hidden from public room listings and unavailable for new bookings. Existing booking records will be preserved."
                confirmLabel={isPending ? "Archiving..." : "Archive Room"}
                isPending={isPending}
                error={error}
                onCancel={() => {
                    setIsConfirming(false);
                    setError(null);
                }}
                onConfirm={handleArchive}
            />
        </>
    );
}