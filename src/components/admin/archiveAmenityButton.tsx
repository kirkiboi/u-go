"use client";

import { useState, useTransition } from "react";
import { archiveAmenity } from "@/app/admin/(dashboard)/amenities/[amenityId]/actions";
import ConfirmModal from "@/components/reusable/confirmModal";

export default function ArchiveAmenityButton({
    amenityId,
}: {
    amenityId: number;
}) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleArchive = () => {
        setError(null);

        startTransition(async () => {
            try {
                await archiveAmenity(amenityId);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to archive amenity.");
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
                Archive Amenity
            </button>

            <ConfirmModal
                isOpen={isConfirming}
                title="Archive Amenity"
                description="Are you sure you want to archive this amenity? It will be hidden from the public amenities page. You can unarchive it later."
                confirmLabel={isPending ? "Archiving..." : "Archive Amenity"}
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