import Link from "next/link";
import { notFound } from "next/navigation";
import { getAmenityById } from "@/services/amenity";
import { editAmenity } from "./actions";
import SaveEditAmenityButton from "@/components/admin/saveEditAmenityButton";
import CancelEditAmenityButton from "@/components/admin/editAmenityButtonCancel";

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

    if (!Number.isInteger(id)) {
        notFound();
    }

    const amenity = await getAmenityById(id);

    if (!amenity) {
        notFound();
    }

    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <p
                        className="text-sm font-medium"
                        style={{
                            color: "var(--color-forest-500)",
                        }}>
                        Amenities Management
                    </p>

                    <h1
                        className="mt-1 text-3xl font-bold"
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "var(--color-forest-900)",
                        }}>
                        Edit {amenity.name}
                    </h1>
                </div>

                <form
                    id="edit-amenity-form"
                    action={editAmenity.bind(null, amenity.id)}
                    className="rounded-xl border bg-white p-6 shadow-sm"
                    style={{
                        borderColor: "var(--color-border)",
                    }}>
                    <div className="space-y-6">
                        <div>
                            <div className="mt-4">
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
                                        className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
                                        style={{
                                            borderColor:
                                                "var(--color-border)",
                                        }}
                                    />
                                </div>
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
                                name="description"
                                rows={5}
                                required
                                defaultValue={amenity.description}
                                className="mt-2 w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
                                style={{
                                    borderColor:
                                        "var(--color-border)",
                                }}
                            />
                        </div>

                        <div>
                            <div className="mt-4">
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
                                    className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-[var(--color-forest-500)]"
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
                        </div>

                        <div>
                            <h2
                                className="text-lg font-semibold"
                                style={{
                                    color: "var(--color-forest-900)",
                                }}>
                                Amenity Image
                            </h2>

                            <div className="mt-4">
                                <div className="overflow-hidden rounded-lg border">
                                    <img
                                        src={amenity.image}
                                        alt={`${amenity.name} amenity`}
                                        className="h-64 w-full object-cover"
                                    />
                                </div>

                                <label
                                    htmlFor="amenity-image"
                                    className="mt-4 block text-sm font-medium">
                                    Replace image
                                </label>

                                <input
                                    id="amenity-image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors file:mr-4 file:rounded-md file:border-0 file:bg-[var(--color-forest-100)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-forest-800)]"
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
                                    Leave this empty to keep the current
                                    image.
                                </p>
                            </div>
                        </div>

                        <div
                            className="flex justify-end gap-3 border-t pt-6"
                            style={{
                                borderColor:
                                    "var(--color-border)",
                            }}>
                            <CancelEditAmenityButton amenityId={amenity.id} />
                            <SaveEditAmenityButton />
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}