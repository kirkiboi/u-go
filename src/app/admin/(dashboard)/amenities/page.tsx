import Link from "next/link";
import { getAmenities } from "@/services/amenity";

export default async function AmenitiesPage() {
    const amenities = await getAmenities();
    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-7xl">
                {amenities.length === 0 ? (
                    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
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
                            Amenities Overview
                        </h1>
                        <p
                            className="mt-4 max-w-md text-sm leading-relaxed"
                            style={{
                                color: "var(--color-muted)",
                            }}>
                            You don&apos;t have any amenities yet. Let&apos;s add your
                            first one and make your resort ready for guests.
                        </p>
                        <Link
                            href="/admin/amenities/add"
                            className="mt-6 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 cursor-pointer"
                            style={{
                                backgroundColor: "var(--color-forest-700)",
                            }}>
                            Add Amenity Here
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-wrap items-end justify-between">
                            <div>
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
                                    Amenities Overview
                                </h1>
                            </div>

                            <Link
                                href="/admin/amenities/add"
                                className="ml-auto shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 cursor-pointer"
                                style={{
                                    backgroundColor:
                                        "var(--color-forest-700)",
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
                                            <p
                                                className="mt-2 max-w-2xl text-sm leading-relaxed"
                                                style={{
                                                    color: "var(--color-muted)",
                                                }}>
                                                {amenity.name}
                                            </p>
                                            <p
                                                className="mt-4 text-sm font-semibold"
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
                                                    color:
                                                        "var(--color-forest-800)",
                                                }}>
                                                View Amenity
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}