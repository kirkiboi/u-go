import SaveAmenityButton from "@/components/admin/saveAmenityButton";
import { addAmenity } from "./actions";
import CancelAmenityButton from "@/components/admin/cancelAmenityButton";
export default function AddAmenityPage() {
    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-4xl">
                <div>
                    <p
                        className="text-sm font-medium"
                        style={{
                            color: "var(--color-forest-500)",
                        }}>
                        Amenities Management
                    </p>
                    <h1
                        className="text-2xl font-semibold"
                        style={{
                            color: "var(--color-forest-900)",
                        }}>
                        Add Amenity
                    </h1>
                </div>

                <div
                    className="mt-8 rounded-xl border bg-white p-6 shadow-sm"
                    style={{
                        borderColor: "var(--color-border)",
                    }}>
                    <form
                        id="add-amenity-form"
                        action={addAmenity}
                        className="space-y-6">
                        <div>
                            <label
                                htmlFor="amenity-name"
                                className="block text-sm font-medium">
                                Amenity name
                            </label>
                            <input
                                id="amenity-name"
                                name="name"
                                type="text"
                                required
                                placeholder="required"
                                className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                                style={{
                                    borderColor:
                                        "var(--color-border)",
                                }}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="amenity-description"
                                className="block text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                id="amenity-description"
                                name="description"
                                rows={5}
                                required
                                placeholder="required"
                                className="mt-2 w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                                style={{
                                    borderColor:
                                        "var(--color-border)",
                                }}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="amenity-image"
                                className="block text-sm font-medium">
                                Amenity image
                            </label>
                            <input
                                id="amenity-image"
                                name="image"
                                type="file"
                                accept="image/*"
                                required
                                className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors file:mr-4 file:rounded-md file:border-0 file:bg-[var(--color-forest-100)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-forest-800)]"
                                style={{
                                    borderColor: "var(--color-border)",
                                }}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Uploading an image of the amenity, either PNG or JPG, is required.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="amenity-time"
                                className="block text-sm font-medium">
                                Time description
                            </label>
                            <input
                                id="amenity-time"
                                name="timeDescription"
                                type="text"
                                required
                                placeholder="required"
                                className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                                style={{
                                    borderColor:
                                        "var(--color-border)",
                                }}
                            />
                            <p
                                className="mt-2 text-xs"
                                style={{
                                    color: "var(--color-muted)",
                                }}>
                                Can be a time range or a descriptive
                                phrase such as &quot;Best After 8:00 PM&quot;.
                            </p>
                        </div>

                        <div
                            className="flex justify-end gap-3 border-t pt-6"
                            style={{
                                borderColor:
                                    "var(--color-border)",
                            }}>
                            <CancelAmenityButton />
                            <SaveAmenityButton />
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}