"use client";

import { useState, useTransition } from "react";
import { removeAmenity } from "@/app/admin/(dashboard)/amenities/[amenityId]/actions";
import ConfirmModal from "@/components/reusable/confirmModal";

export default function DeleteAmenityButton({
    amenityId,
}: {
    amenityId: number;
}) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleDelete = () => {
        setError(null);

        startTransition(async () => {
            try {
                await removeAmenity(amenityId);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to delete amenity."
                );
            }
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsConfirming(true)}
                className="rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:cursor-pointer"
                style={{
                    borderColor: "#b91c1c",
                    color: "#b91c1c",
                }}>
                Delete Amenity
            </button>

            <ConfirmModal
                isOpen={isConfirming}
                title="Delete Amenity"
                description="Are you sure you want to delete this amenity? This action cannot be undone and will permanently remove the amenity and its associated storage image."
                confirmLabel={
                    isPending ? "Deleting..." : "Delete Amenity"
                }
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