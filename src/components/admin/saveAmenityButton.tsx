"use client";

import { useState } from "react";
import SaveModal from "@/components/reusable/saveModal";

export default function SaveAmenityButton() {
    const [isConfirming, setIsConfirming] = useState(false);
    const handleSaveClick = () => {
        const form = document.getElementById(
            "add-amenity-form"
        ) as HTMLFormElement | null;

        if (!form) {
            return;
        }

        if (!form.checkValidity()) {
            const firstInvalidField = form.querySelector(
                ":invalid"
            ) as HTMLInputElement | HTMLTextAreaElement | null;

            if (firstInvalidField) {
                firstInvalidField.focus();
                firstInvalidField.reportValidity();
            }
            return;
        }
        setIsConfirming(true);
    };

    const handleConfirm = () => {
        const form = document.getElementById(
            "add-amenity-form"
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
                Save Amenity
            </button>

            <SaveModal
                isOpen={isConfirming}
                title="Save Amenity"
                description="Are you sure you want to save this amenity? The amenity will be added to the system."
                saveLabel="Save Amenity"
                onCancel={() => setIsConfirming(false)}
                onConfirm={handleConfirm}
            />
        </>
    );
}