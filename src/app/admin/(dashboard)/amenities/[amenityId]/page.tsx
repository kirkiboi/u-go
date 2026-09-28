"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

const amenity = {
    name: "Swimming Pool",
    description:
        "A refreshing outdoor pool surrounded by peaceful mountain scenery. Guests can enjoy a relaxing swim while taking in the natural surroundings of U-Go Mountain Resort.",
    category: "Recreation",
    featured: true,
    active: true,
    image: "/images/swimming_pool.jpg",
};

export default function AmenityViewPage() {
    const params = useParams();

    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-5xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
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
                                {amenity.name}
                            </h1>
                            <span
                                className="rounded-full px-2.5 py-1 text-xs font-medium"
                                style={{
                                    backgroundColor:
                                        "var(--color-forest-100)",
                                    color: "var(--color-forest-700)",
                                }}>
                                Active
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
                    </div>

                    <Link
                        href={`/admin/amenities/${params.amenityId}/edit`}
                        className="shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
                        style={{
                            backgroundColor: "var(--color-forest-700)",
                        }}>
                        Edit Amenity
                    </Link>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                    <div
                        className="overflow-hidden rounded-xl border bg-white shadow-sm"
                        style={{
                            borderColor: "var(--color-border)",
                        }}>
                        <div className="aspect-[16/10] bg-gray-100">
                            <img
                                src={amenity.image}
                                alt={amenity.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                    <div
                        className="rounded-xl border bg-white p-6 shadow-sm"
                        style={{
                            borderColor: "var(--color-border)",
                        }}>
                        <h2
                            className="text-lg font-semibold"
                            style={{
                                color: "var(--color-forest-900)",
                            }}>
                            Amenity Information
                        </h2>

                        <div className="mt-6 space-y-5">

                            <div>
                                <p
                                    className="text-xs font-medium uppercase tracking-wide"
                                    style={{
                                        color: "var(--color-muted)",
                                    }}>
                                    Category
                                </p>
                                <p
                                    className="mt-1 text-sm font-medium"
                                    style={{
                                        color: "var(--color-forest-900)",
                                    }}>
                                    {amenity.category}
                                </p>
                            </div>

                            <div>
                                <p
                                    className="text-xs font-medium uppercase tracking-wide"
                                    style={{
                                        color: "var(--color-muted)",
                                    }}>
                                    Description
                                </p>
                                <p
                                    className="mt-1 text-sm leading-relaxed"
                                    style={{
                                        color: "var(--color-text)",
                                    }}>
                                    {amenity.description}
                                </p>
                            </div>

                            <div
                                className="border-t pt-5"
                                style={{
                                    borderColor: "var(--color-border)",
                                }}>
                                <p
                                    className="text-xs font-medium uppercase tracking-wide"
                                    style={{
                                        color: "var(--color-muted)",
                                    }}>
                                    Website Display
                                </p>
                                <div className="mt-3 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">
                                            Active
                                        </span>
                                        <span
                                            className="rounded-full px-2.5 py-1 text-xs font-medium"
                                            style={{
                                                backgroundColor:
                                                    "var(--color-forest-100)",
                                                color:
                                                    "var(--color-forest-700)",
                                            }}>
                                            {amenity.active
                                                ? "Visible"
                                                : "Hidden"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">
                                            Featured Experience
                                        </span>
                                        <span
                                            className="rounded-full px-2.5 py-1 text-xs font-medium"
                                            style={{
                                                backgroundColor:
                                                    amenity.featured
                                                        ? "var(--color-forest-700)"
                                                        : "var(--color-forest-100)",
                                                color:
                                                    amenity.featured
                                                        ? "white"
                                                        : "var(--color-forest-700)",
                                            }}>
                                            {amenity.featured
                                                ? "Featured"
                                                : "Standard"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="mt-6 rounded-xl border bg-white p-6 shadow-sm"
                    style={{
                        borderColor: "var(--color-border)",
                    }}>
                    <h2
                        className="text-lg font-semibold"
                        style={{
                            color: "var(--color-forest-900)",
                        }}>
                        Public Website Preview
                    </h2>

                    <p
                        className="mt-2 text-sm leading-relaxed"
                        style={{
                            color: "var(--color-muted)",
                        }}>
                        This amenity can appear on the public resort website
                        based on its active and featured settings.
                    </p>

                    <div className="mt-5">
                        <Link
                            href="/amenities"
                            target="_blank"
                            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-70"
                            style={{
                                color: "var(--color-forest-700)",
                            }}>
                            View on public website
                            <span aria-hidden="true">↗</span>
                        </Link>
                    </div>
                </div>
                <div className="mt-6">
                    <Link
                        href="/admin/amenities"
                        className="text-sm font-medium transition-colors hover:opacity-70"
                        style={{
                            color: "var(--color-forest-700)",
                        }}>
                        ← Back to Amenities
                    </Link>
                </div>
            </div>
        </section>
    );
}