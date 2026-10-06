import Link from "next/link";
import { notFound } from "next/navigation";
import { getAmenityById } from "@/services/amenity";
import { editAmenity } from "./actions";

interface EditAmenityPageProps {
    params: Promise<{
        amenityId: string;
    }>;
}

export default async function EditAmenityPage({
    params,
}: EditAmenityPageProps) {
    const { amenityId } = await params;
    const id = Number(amenityId);

    if (Number.isNaN(id)) {
        notFound();
    }

    const amenity = await getAmenityById(id);

    if (!amenity) {
        notFound();
    }

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
                        Edit Amenity
                    </h1>
                </div>

                <div
                    className="mt-8 rounded-xl border bg-white p-6 shadow-sm"
                    style={{
                        borderColor: "var(--color-border)",
                    }}>
                    <form
                        id="edit-amenity-form"
                        action={editAmenity.bind(null, amenity.id)}
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
                                defaultValue={amenity.name}
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
                                defaultValue={amenity.description}
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

                            <div className="mt-2">
                                <img
                                    src={amenity.image}
                                    alt={amenity.name}
                                    className="mb-4 h-48 w-full rounded-lg object-cover"
                                />

                                <input
                                    id="amenity-image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors file:mr-4 file:rounded-md file:border-0 file:bg-[var(--color-forest-100)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-forest-800)]"
                                    style={{
                                        borderColor:
                                            "var(--color-border)",
                                    }}
                                />

                                <p className="mt-1 text-xs text-gray-500">
                                    Upload a new PNG or JPG only if you
                                    want to replace the current image.
                                </p>
                            </div>
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
                                defaultValue={
                                    amenity.timeDescription
                                }
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
                                phrase such as "Best After 8:00 PM".
                            </p>
                        </div>

                        <div
                            className="flex justify-end gap-3 border-t pt-6"
                            style={{
                                borderColor:
                                    "var(--color-border)",
                            }}>
                            <Link
                                href={`/admin/amenities/${amenity.id}`}
                                className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
                                style={{
                                    borderColor:
                                        "var(--color-border)",
                                    color:
                                        "var(--color-forest-800)",
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
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}