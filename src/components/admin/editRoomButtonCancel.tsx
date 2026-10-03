"use client";
import { useState } from "react";
import Link from "next/link";
import CancelModal from "@/components/reusable/cancelModal";
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

            <CancelModal
                isOpen={isConfirming}
                title="Discard Changes"
                description="Are you sure you want to go back? Any changes you made will be discarded."
                href={`/admin/rooms/${roomId}`}
                onCancel={() => setIsConfirming(false)}
            />
        </>
    );
}