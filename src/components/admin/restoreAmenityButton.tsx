"use client";

import { useState, useTransition } from "react";
import { restoreAmenity } from "@/app/admin/(dashboard)/amenities/[amenityId]/actions";
import ConfirmModal from "@/components/reusable/confirmModal";

export default function RestoreAmenityButton({
    amenityId,
}: {
    amenityId: number;
}) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleRestore = () => {
        setError(null);

        startTransition(async () => {
            try {
                await restoreAmenity(amenityId);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to restore amenity."
                );
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
                title="Unarchive Amenity"
                description="Are you sure you want to unarchive this amenity? It will become visible on the public amenities page again."
                confirmLabel={isPending ? "Unarchiving..." : "Unarchive Amenity"}
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