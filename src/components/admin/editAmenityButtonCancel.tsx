"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CancelModal from "@/components/reusable/cancelModal";

export default function CancelEditAmenityButton({
    amenityId,
}: {
    amenityId: number;
}) {
    const [isConfirming, setIsConfirming] = useState(false);
    const router = useRouter();

    const handleConfirm = () => {
        router.push(`/admin/amenities/${amenityId}`);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsConfirming(true)}
                className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
                style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-forest-800)",
                }}>
                Cancel
            </button>

            <CancelModal
                isOpen={isConfirming}
                title="Cancel Changes"
                description="Are you sure you want to cancel? Any changes you made will be lost."
                cancelLabel="Continue Editing"
                confirmLabel="Cancel"
                onCancel={() => setIsConfirming(false)}
                href={`/admin/amenities/${amenityId}`}
            />
        </>
    );
}
