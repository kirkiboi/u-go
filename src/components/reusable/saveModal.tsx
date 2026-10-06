"use client";

interface SaveModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    saveLabel?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function SaveModal({
    isOpen,
    title,
    description,
    saveLabel = "Save",
    onCancel,
    onConfirm,
}: SaveModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
                <h3
                    className="text-lg font-bold"
                    style={{ color: "white" }}>
                    {title}
                </h3>

                <p
                    className="mt-2 text-sm"
                    style={{ color: "white" }}>
                    {description}
                </p>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors text-white hover:bg-white hover:text-black cursor-pointer"
                        style={{
                            borderColor: "var(--color-border)",
                        }}>
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 cursor-pointer"
                        style={{
                            backgroundColor: "var(--color-forest-700)",
                        }}>
                        {saveLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}