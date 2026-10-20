"use client";

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    isLoading?: boolean;
    variant?: "default" | "danger";
    onCancel: () => void;
    onConfirm: () => void;
}

export default function ConfirmationModal({
    isOpen,
    title,
    description,
    confirmLabel = "Confirm",
    isLoading = false,
    variant = "default",
    onCancel,
    onConfirm,
}: ConfirmationModalProps) {
    if (!isOpen) {
        return null;
    }

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
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="cursor-pointer rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-600 dark:text-white dark:hover:bg-slate-800">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                        style={{
                            backgroundColor: variant === "danger" ? "#b91c1c" : "var(--color-forest-700)",
                        }}>
                        {isLoading ? "Please wait..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}