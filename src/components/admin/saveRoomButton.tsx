"use client";

import { useState } from "react";
import SaveModal from "@/components/reusable/saveModal";

export default function SaveRoomButton() {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleSaveClick = () => {
        const form = document.getElementById(
            "add-room-form"
        ) as HTMLFormElement | null;

        if (!form) {
            return;
        }

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        setIsConfirming(true);
    };

    const handleConfirm = () => {
        const form = document.getElementById(
            "add-room-form"
        ) as HTMLFormElement | null;

        if (!form) {
            return;
        }

        form.requestSubmit();
    };

    return (
        <>
            <button
                type="button"
                onClick={handleSaveClick}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 hover:cursor-pointer"
                style={{
                    backgroundColor: "var(--color-forest-700)",
                }}>
                Save Room
            </button>

            <SaveModal
                isOpen={isConfirming}
                title="Save Room"
                description="Are you sure you want to save this room? The room will be added to the system."
                saveLabel="Save Room"
                onCancel={() => setIsConfirming(false)}
                onConfirm={handleConfirm}
            />
        </>
    );
}