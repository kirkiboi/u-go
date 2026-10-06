import Link from "next/link";
import { notFound } from "next/navigation";
import { getAmenityById } from "@/services/amenity";

interface AmenityPageProps {
    params: Promise<{
        amenityId: string;
    }>;
}

export default async function AmenityPage({
    params,
}: AmenityPageProps) {
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
                        Amenity Details
                    </h1>
                </div>

                <div
                    className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm"
                    style={{
                        borderColor: "var(--color-border)",
                    }}>
                    <div className="grid md:grid-cols-2">
                        <div className="bg-gray-100">
                            <img
                                src={amenity.image}
                                alt={amenity.name}
                                className="h-full min-h-80 w-full object-cover"
                            />
                        </div>

                        <div className="p-6">
                            <h2
                                className="text-2xl font-semibold"
                                style={{
                                    color:
                                        "var(--color-forest-900)",
                                }}>
                                {amenity.name}
                            </h2>

                            <div className="mt-6">
                                <p
                                    className="text-sm font-medium"
                                    style={{
                                        color:
                                            "var(--color-forest-700)",
                                    }}>
                                    Description
                                </p>
                                <p
                                    className="mt-2 text-sm leading-relaxed"
                                    style={{
                                        color:
                                            "var(--color-muted)",
                                    }}>
                                    {amenity.description}
                                </p>
                            </div>

                            <div className="mt-6">
                                <p
                                    className="text-sm font-medium"
                                    style={{
                                        color:
                                            "var(--color-forest-700)",
                                    }}>
                                    Time
                                </p>
                                <p
                                    className="mt-2 text-sm"
                                    style={{
                                        color:
                                            "var(--color-muted)",
                                    }}>
                                    {amenity.timeDescription}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="flex justify-end gap-3 border-t p-6"
                        style={{
                            borderColor:
                                "var(--color-border)",
                        }}>
                        <Link
                            href="/admin/amenities"
                            className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
                            style={{
                                borderColor:
                                    "var(--color-border)",
                                color:
                                    "var(--color-forest-800)",
                            }}>
                            Back to Amenities
                        </Link>

                        <Link
                            href={`/admin/amenities/${amenity.id}/edit`}
                            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                            style={{
                                backgroundColor:
                                    "var(--color-forest-700)",
                            }}>
                            Edit Amenity
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}