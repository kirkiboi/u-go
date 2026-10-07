"use client";

import { useState } from "react";
import CancelModal from "@/components/reusable/cancelModal";

export default function CancelAmenityButton() {
    const [isConfirming, setIsConfirming] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsConfirming(true)}
                className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 cursor-pointer"
                style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-forest-800)",
                }}>
                Cancel
            </button>

            <CancelModal
                isOpen={isConfirming}
                title="Cancel Adding Amenity"
                description="Are you sure you want to cancel? Any information you entered will be lost."
                cancelLabel="Continue Editing"
                confirmLabel="Cancel"
                onCancel={() => setIsConfirming(false)}
                href="/admin/amenities"
            />
        </>
    );
}