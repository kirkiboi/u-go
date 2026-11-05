import Link from "next/link";
import {
    getAmenities,
    getArchivedAmenities,
} from "@/services/amenity";
import AmenitiesList from "./pagination";

export default async function AmenitiesPage() {
    const [amenities, archivedAmenities] = await Promise.all([
        getAmenities(),
        getArchivedAmenities(),
    ]);
    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-7xl">
                {amenities.length === 0 &&
                    archivedAmenities.length === 0 ? (
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
                            You don&apos;t have any amenities yet. Let&apos;s add
                            your first one and make your resort ready for guests.
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
                                    backgroundColor: "var(--color-forest-700)",
                                }}>
                                + Add Amenity
                            </Link>
                        </div>

                        <AmenitiesList
                            amenities={amenities}
                            archivedAmenities={archivedAmenities}
                        />
                    </>
                )}
            </div>
        </section>
    );
}