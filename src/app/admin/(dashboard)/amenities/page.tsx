import Link from "next/link";
import { getAmenities } from "@/services/amenity";

export default async function AmenitiesPage() {
    const amenities = await getAmenities();
    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <p
                            className="w-full text-sm font-medium"
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
                            Amenities Overview
                        </h1>
                    </div>

                    <Link
                        href="/admin/amenities/add"
                        className="shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
                        style={{
                            backgroundColor: "var(--color-forest-700)",
                        }}>
                        + Add Amenity
                    </Link>
                </div>

                <div className="mt-8 space-y-4">
                    {amenities.map((amenity) => (
                        <div
                            key={amenity.id}
                            className="rounded-xl border bg-white p-6 shadow-sm"
                            style={{
                                borderColor: "var(--color-border)",
                            }}>
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="min-w-0">
                                    <h2
                                        className="text-xl font-semibold"
                                        style={{
                                            color: "var(--color-forest-900)",
                                        }}>
                                        {amenity.name}
                                    </h2>

                                    <p
                                        className="mt-2 max-w-2xl text-sm leading-relaxed"
                                        style={{
                                            color: "var(--color-muted)",
                                        }}>
                                        {amenity.description}
                                    </p>

                                    <p
                                        className="mt-4 text-sm font-medium"
                                        style={{
                                            color: "var(--color-forest-700)",
                                        }}>
                                        {amenity.timeDescription}
                                    </p>
                                </div>

                                <div className="flex shrink-0 gap-2">
                                    <Link
                                        href={`/admin/amenities/${amenity.id}`}
                                        className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
                                        style={{
                                            backgroundColor:
                                                "var(--color-forest-100)",
                                            color: "var(--color-forest-800)",
                                        }}>
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}