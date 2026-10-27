"use client";

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    variant?: "default" | "danger";
    confirmPosition?: "left" | "right";
    onCancel: () => void;
    onConfirm: () => void;
    greenButton?: "confirm" | "cancel";
}

export default function ConfirmationModal({
    isOpen,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    isLoading = false,
    confirmPosition = "right",
    onCancel,
    onConfirm,
}: ConfirmationModalProps) {
    if (!isOpen) {
        return null;
    }
    const confirmButton = (
        <button
            key="confirm"
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${confirmPosition === "right" ? "" : "border font-medium transition-colors hover:bg-white hover:text-black"}`}
            style={
                confirmPosition === "right"
                    ? { backgroundColor: "var(--color-forest-700)", }
                    : { borderColor: "var(--color-border)", }
            }>
            {isLoading ? "Please wait..." : confirmLabel}
        </button>
    );

    const cancelButton = (
        <button
            key="cancel"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 cursor-pointer ${confirmPosition === "left" ? "" : "border font-medium transition-colors hover:bg-white hover:text-black"}`}
            style={
                confirmPosition === "left"
                    ? { backgroundColor: "var(--color-forest-700)", }
                    : { borderColor: "var(--color-border)", }
            }>
            {cancelLabel}
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirmation-modal-title"
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
                <h3
                    id="confirmation-modal-title"
                    className="text-lg font-bold text-stone-900 dark:text-white">
                    {title}
                </h3>
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
                    {description}
                </p>
                <div className="mt-6 flex items-center justify-end gap-3">
                    {confirmPosition === "left" ? (
                        <>
                            {confirmButton}
                            {cancelButton}
                        </>
                    ) : (
                        <>
                            {cancelButton}
                            {confirmButton}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
