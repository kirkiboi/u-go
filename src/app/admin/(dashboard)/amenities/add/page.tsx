import Link from "next/link";
export default function AddAmenityPage() {
    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-4xl">

                <div>
                    <h1
                        className="text-2xl font-semibold"
                        style={{
                            color: "var(--color-forest-900)",
                        }}>
                        Add Amenity
                    </h1>

                    <p
                        className="mt-1 text-sm"
                        style={{
                            color: "var(--color-muted)",
                        }}>
                        Add a new experience or facility to your resort.
                    </p>
                </div>
                <div
                    className="mt-8 rounded-xl border bg-white p-6 shadow-sm"
                    style={{
                        borderColor: "var(--color-border)",
                    }}>
                    <form className="space-y-6">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="amenity-name"
                                    className="block text-sm font-medium">
                                    Amenity name
                                </label>

                                <input
                                    id="amenity-name"
                                    type="text"
                                    placeholder="e.g. Swimming Pool"
                                    className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                                    style={{
                                        borderColor: "var(--color-border)",
                                    }}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="amenity-category"
                                    className="block text-sm font-medium">
                                    Category
                                </label>

                                <select
                                    id="amenity-category"
                                    className="mt-2 w-full rounded-lg border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                                    style={{
                                        borderColor: "var(--color-border)",
                                    }}
                                    defaultValue="">
                                    <option value="" disabled>
                                        Select a category
                                    </option>
                                    <option value="recreation">
                                        Recreation
                                    </option>
                                    <option value="outdoor">
                                        Outdoor
                                    </option>
                                    <option value="family">
                                        Family
                                    </option>
                                    <option value="relaxation">
                                        Relaxation
                                    </option>
                                    <option value="dining">
                                        Dining
                                    </option>
                                    <option value="other">
                                        Other
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="amenity-description"
                                className="block text-sm font-medium">
                                Description
                            </label>

                            <textarea
                                id="amenity-description"
                                rows={5}
                                placeholder="Describe the amenity and what guests can expect..."
                                className="mt-2 w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                                style={{
                                    borderColor: "var(--color-border)",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="amenity-image"
                                className="block text-sm font-medium">
                                Amenity image
                            </label>

                            <div
                                className="mt-2 rounded-lg border-2 border-dashed p-6 text-center"
                                style={{
                                    borderColor: "var(--color-border)",
                                }}>
                                <input
                                    id="amenity-image"
                                    type="file"
                                    accept="image/*"
                                    className="mx-auto block w-full max-w-sm text-sm"
                                />

                                <p
                                    className="mt-2 text-xs"
                                    style={{
                                        color: "var(--color-muted)",
                                    }}>
                                    Upload an image representing this
                                    amenity.
                                </p>
                            </div>
                        </div>
                        <div
                            className="rounded-lg border p-5"
                            style={{
                                borderColor: "var(--color-border)",
                                backgroundColor:
                                    "var(--color-forest-50)",
                            }}>
                            <h2
                                className="text-sm font-semibold"
                                style={{
                                    color: "var(--color-forest-900)",
                                }}>
                                Amenity Settings
                            </h2>

                            <div className="mt-4 space-y-4">
                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="mt-0.5 h-4 w-4"
                                        style={{
                                            accentColor:
                                                "var(--color-forest-600)",
                                        }}
                                    />

                                    <div>
                                        <p className="text-sm font-medium">
                                            Active
                                        </p>

                                        <p
                                            className="mt-0.5 text-xs"
                                            style={{
                                                color:
                                                    "var(--color-muted)",
                                            }}>
                                            Make this amenity visible on
                                            the public website.
                                        </p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        className="mt-0.5 h-4 w-4"
                                        style={{
                                            accentColor:
                                                "var(--color-forest-600)",
                                        }}
                                    />

                                    <div>
                                        <p className="text-sm font-medium">
                                            Featured Experience
                                        </p>

                                        <p
                                            className="mt-0.5 text-xs"
                                            style={{
                                                color:
                                                    "var(--color-muted)",
                                            }}>
                                            Highlight this amenity in the
                                            featured experience section.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div
                            className="flex justify-end gap-3 border-t pt-6"
                            style={{
                                borderColor: "var(--color-border)",
                            }}>
                            <Link
                                href="/admin/amenities"
                                className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
                                style={{
                                    borderColor: "var(--color-border)",
                                    color: "var(--color-forest-800)",
                                }}>
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                                style={{
                                    backgroundColor:
                                        "var(--color-forest-700)",
                                }}>
                                Save Amenity
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}