import Link from "next/link";
const amenities = [
    {
        id: "amenity-1",
        name: "Swimming Pool",
        description:
            "A refreshing outdoor pool surrounded by peaceful mountain scenery.",
        category: "Recreation",
        featured: true,
        status: "Active",
    },
    {
        id: "amenity-2",
        name: "Bonfire Area",
        description:
            "A cozy outdoor space for evening gatherings, conversations, and relaxing by the fire.",
        category: "Outdoor",
        featured: false,
        status: "Active",
    },
    {
        id: "amenity-3",
        name: "Playground",
        description:
            "A family-friendly outdoor area where children can enjoy their time at the resort.",
        category: "Family",
        featured: false,
        status: "Active",
    },
    {
        id: "amenity-4",
        name: "Mountain View Deck",
        description:
            "A peaceful viewing area overlooking the surrounding mountains and natural scenery.",
        category: "Relaxation",
        featured: false,
        status: "Active",
    },
];

export default function AmenitiesPage() {
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
                                    <div className="flex flex-wrap items-center gap-3">

                                        <h2
                                            className="text-xl font-semibold"
                                            style={{
                                                color: "var(--color-forest-900)",
                                            }}>
                                            {amenity.name}
                                        </h2>

                                        <span
                                            className="rounded-full px-2.5 py-1 text-xs font-medium"
                                            style={{
                                                backgroundColor:
                                                    "var(--color-forest-100)",
                                                color:
                                                    "var(--color-forest-700)",
                                            }}>
                                            {amenity.status}
                                        </span>
                                        {amenity.featured && (
                                            <span
                                                className="rounded-full px-2.5 py-1 text-xs font-medium"
                                                style={{
                                                    backgroundColor:
                                                        "var(--color-forest-700)",
                                                    color: "white",
                                                }}>
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    <p
                                        className="mt-2 max-w-2xl text-sm leading-relaxed"
                                        style={{
                                            color: "var(--color-muted)",
                                        }}>
                                        {amenity.description}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                        <span>
                                            <strong>Category:</strong>{" "}
                                            {amenity.category}
                                        </span>
                                        <span>
                                            <strong>Featured:</strong>{" "}
                                            {amenity.featured
                                                ? "Yes"
                                                : "No"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex shrink-0 gap-2">
                                    <Link
                                        href={`/admin/amenities/${amenity.id}/edit`}
                                        className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
                                        style={{
                                            borderColor:
                                                "var(--color-border)",
                                            color:
                                                "var(--color-forest-800)",
                                        }}>
                                        Edit
                                    </Link>

                                    <Link
                                        href={`/admin/amenities/${amenity.id}`}
                                        className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
                                        style={{
                                            backgroundColor:
                                                "var(--color-forest-100)",
                                            color:
                                                "var(--color-forest-800)",
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