import Link from "next/link";
import { notFound } from "next/navigation";
import { getAmenityById } from "@/services/amenity";
import DeleteAmenityButton from "@/components/admin/deleteAmenityButton";

interface AmenityPageProps {
    params: Promise<{
        amenityId: string;
    }>;
}

export default async function AmenityDetailsPage({
    params,
}: AmenityPageProps) {
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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p
                            className="text-sm font-medium"
                            style={{
                                color: "var(--color-forest-500)",
                            }}>
                            Amenities Management
                        </p>
                        <div className="mt-1 flex items-center gap-3">
                            <h1
                                className="text-3xl font-bold"
                                style={{
                                    fontFamily: "var(--font-display)",
                                    color: "var(--color-forest-900)",
                                }}>
                                {amenity.name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={`/admin/amenities/${amenity.id}/edit`}
                            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
                            style={{
                                backgroundColor: "var(--color-forest-700)",
                            }}>
                            Edit Amenity
                        </Link >
                        <DeleteAmenityButton
                            amenityId={amenity.id}
                        />
                    </div >
                </div >

                <div className="mt-8 space-y-6">
                    <div
                        className="rounded-xl border bg-white p-6 shadow-sm"
                        style={{
                            borderColor: "var(--color-border)",
                        }}>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Name
                                </p>
                                <p className="mt-1 font-semibold">
                                    {amenity.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Time
                                </p>
                                <p className="mt-1 font-semibold">
                                    {amenity.timeDescription}
                                </p>
                            </div>
                        </div>
                        <br />
                        <div>
                            <p className="text-xs text-gray-500">
                                Description
                            </p>

                            <p className="mt-1 font-semibold">
                                {amenity.description}
                            </p>
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
                            Amenity Image
                        </h2>

                        <div className="mt-4 overflow-hidden rounded-lg border">
                            <img
                                src={amenity.image}
                                alt={`${amenity.name} amenity`}
                                className="h-auto max-h-[500px] w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div >
        </section >
    );
}