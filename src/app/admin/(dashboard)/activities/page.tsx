import Link from "next/link";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";

const PAGE_SIZE = 3;

type SearchParams = {
    tab?: string;
    bookingSearch?: string;
    bookingPage?: string;
    catalogSearch?: string;
    catalogPage?: string;
};

function parsePage(value?: string): number {
    const page = Number(value);
    return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

function getPageCount(total: number): number {
    return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-PH", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(date);
}

function formatAction(action: string): string {
    return action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatField(field: string): string {
    return field.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(field: string, value: unknown): string {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    if (/image/i.test(field)) {
        return "Image";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (typeof value === "number") {
        return /price|total|amount/i.test(field) ? `₱${value.toLocaleString("en-PH")}` : String(value);
    }

    if (typeof value === "string") {
        if (/^(check_in|check_out|checkin|checkout)$/i.test(field) && /^\d{4}-\d{2}-\d{2}/.test(value)) {
            return value.slice(0, 10);
        }

        if (/status/i.test(field)) {
            return value.replace(/_/g, " ");
        }
        return value;
    }

    return JSON.stringify(value);
}

function asRecord(value: Prisma.JsonValue | null | undefined,): Record<string, unknown> {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as Record<string, unknown>;
    }

    return {};
}

function getChanges(previous: Prisma.JsonValue | null | undefined, next: Prisma.JsonValue | null | undefined,) {
    const oldData = asRecord(previous);
    const newData = asRecord(next);
    const keys = [...new Set([
        ...Object.keys(oldData),
        ...Object.keys(newData),
    ])];

    return keys
        .filter((key) => key !== "booking_ref")
        .filter((key) => {
            if (!(key in oldData) || !(key in newData)) {
                return true;
            }

            return JSON.stringify(oldData[key]) !== JSON.stringify(newData[key]);
        })
        .map((key) => ({
            key,
            label: formatField(key),
            oldValue: formatValue(key, oldData[key]),
            newValue: formatValue(key, newData[key]),
        }));
}

function getActor(actorType: string, admin?: { name: string | null; email: string } | null,): string {
    if (admin) {
        return admin.name?.trim() || admin.email;
    }

    switch (actorType.toUpperCase()) {
        case "CUSTOMER":
            return "Customer";
        case "PAYMONGO":
            return "PayMongo";
        case "SYSTEM":
            return "System";
        default:
            return "Administrator";
    }
}

function getTypeStyles(type: "booking" | "room" | "amenity") {
    switch (type) {
        case "booking":
            return {
                backgroundColor: "var(--color-forest-100)",
                color: "var(--color-forest-700)",
            };
        case "room":
            return {
                backgroundColor: "#dbeafe",
                color: "#1d4ed8",
            };
        case "amenity":
            return {
                backgroundColor: "#fef3c7",
                color: "#92400e",
            };
    }
}

function paginationHref(
    feed: "booking" | "catalog",
    search: string,
    page: number,
): string {
    const params = new URLSearchParams();
    params.set("tab", feed);

    if (search) {
        params.set(feed === "booking" ? "bookingSearch" : "catalogSearch", search,);
    }

    params.set(feed === "booking" ? "bookingPage" : "catalogPage", String(page),);
    return `/admin/activities?${params.toString()}`;
}

function Pagination({
    feed,
    search,
    page,
    totalPages,
}: {
    feed: "booking" | "catalog";
    search: string;
    page: number;
    totalPages: number;
}) {
    return (
        <div
            className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4"
            style={{ borderColor: "var(--color-border)" }} >
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                Page {page} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
                {page > 1 ? (
                    <Link
                        href={paginationHref(feed, search, page - 1)}
                        className="rounded-lg border px-3 py-2 text-sm font-medium"
                        style={{
                            borderColor: "var(--color-border)",
                            color: "var(--color-forest-800)",
                        }}>
                        Previous
                    </Link>
                ) : (
                    <span
                        className="rounded-lg border px-3 py-2 text-sm"
                        style={{
                            borderColor: "var(--color-border)",
                            color: "var(--color-muted)",
                        }}>
                        Previous
                    </span>
                )}

                {page < totalPages ? (
                    <Link
                        href={paginationHref(feed, search, page + 1)}
                        className="rounded-lg border px-3 py-2 text-sm font-medium"
                        style={{
                            borderColor: "var(--color-border)",
                            color: "var(--color-forest-800)",
                        }}>
                        Next
                    </Link>
                ) : (
                    <span
                        className="rounded-lg border px-3 py-2 text-sm"
                        style={{
                            borderColor: "var(--color-border)",
                            color: "var(--color-muted)",
                        }}>
                        Next
                    </span>
                )}
            </div>
        </div>
    );
}

export default async function ActivitiesPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    await requireAdmin();

    const params = await searchParams;
    const activeTab = params.tab === "catalog" ? "catalog" : "booking";
    const bookingSearch = (params.bookingSearch ?? "").trim().slice(0, 100);
    const catalogSearch = (params.catalogSearch ?? "").trim().slice(0, 100);
    const requestedBookingPage = parsePage(params.bookingPage);
    const requestedCatalogPage = parsePage(params.catalogPage);

    const matchingBookings = bookingSearch
        ? await prisma.booking.findMany({
            where: {
                OR: [
                    {
                        booking_ref: {
                            contains: bookingSearch,
                            mode: "insensitive",
                        },
                    },
                    {
                        AND: bookingSearch.split(/\s+/).filter(Boolean).map((part) => ({
                            OR: [
                                {
                                    guest_fname: {
                                        contains: part,
                                        mode: "insensitive" as const,
                                    },
                                },
                                {
                                    guest_lname: {
                                        contains: part,
                                        mode: "insensitive" as const,
                                    },
                                },
                            ],
                        })),
                    },
                ],
            },
            select: { id: true },
        })
        : null;

    const bookingWhere: Prisma.BookingAuditLogWhereInput = bookingSearch
        ? {
            booking_id: {
                in: matchingBookings!.map((booking) => booking.id),
            },
        }
        : {};

    const catalogWhere: Prisma.ActivityLogWhereInput = {
        entity_type: {
            in: ["ROOM", "AMENITY", "Room", "Amenity"],
        },
        ...(catalogSearch
            ? {
                entity_name: {
                    contains: catalogSearch,
                    mode: "insensitive" as const,
                },
            }
            : {}),
    };

    const [bookingTotal, catalogTotal] = await Promise.all([
        prisma.bookingAuditLog.count({ where: bookingWhere }),
        prisma.activityLog.count({ where: catalogWhere }),
    ]);

    const bookingTotalPages = getPageCount(bookingTotal);
    const catalogTotalPages = getPageCount(catalogTotal);
    const bookingPage = Math.min(requestedBookingPage, bookingTotalPages);
    const catalogPage = Math.min(requestedCatalogPage, catalogTotalPages);

    const [bookingLogs, catalogLogs] = await Promise.all([
        prisma.bookingAuditLog.findMany({
            where: bookingWhere,
            include: {
                admin: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            skip: (bookingPage - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        }),
        prisma.activityLog.findMany({
            where: catalogWhere,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            skip: (catalogPage - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        }),
    ]);
    const bookingDetails = await prisma.booking.findMany({
        where: {
            id: {
                in: bookingLogs.map((log) => log.booking_id),
            },
        },
        select: {
            id: true,
            guest_fname: true,
            guest_lname: true,
        },
    });
    const bookingDetailsMap = new Map(
        bookingDetails.map((booking) => [
            booking.id,
            `${booking.guest_fname} ${booking.guest_lname}`.trim(),
        ]),
    );
    return (
        <main className="min-h-screen px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-7xl">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p
                            className="text-sm font-medium"
                            style={{ color: "var(--color-forest-500)" }}>
                            Activity Logs
                        </p>

                        <h1
                            className="mt-1 text-3xl font-bold"
                            style={{
                                fontFamily: "var(--font-display)",
                                color: "var(--color-forest-900)",
                            }}>
                            Activities Overview
                        </h1>

                        <p
                            className="mt-2 text-sm"
                            style={{ color: "var(--color-muted)" }}>
                            Review booking changes and resort inventory activity.
                            Times are displayed in Philippine time.
                        </p>
                    </div>

                    <div
                        className="flex shrink-0 gap-2 rounded-xl border p-1"
                        style={{
                            borderColor: "var(--color-border)",
                            backgroundColor: "#f9fafb",
                        }}>
                        <Link
                            href="/admin/activities?tab=booking"
                            aria-current={activeTab === "booking" ? "page" : undefined}
                            className="rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
                            style={
                                activeTab === "booking"
                                    ? {
                                        backgroundColor: "var(--color-forest-700)",
                                        color: "#ffffff",
                                    }
                                    : {
                                        color: "var(--color-muted)",
                                    }
                            }>
                            Bookings
                        </Link>

                        <Link
                            href="/admin/activities?tab=catalog"
                            aria-current={activeTab === "catalog" ? "page" : undefined}
                            className="rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
                            style={
                                activeTab === "catalog"
                                    ? {
                                        backgroundColor: "var(--color-forest-700)",
                                        color: "#ffffff",
                                    }
                                    : {
                                        color: "var(--color-muted)",
                                    }
                            }>
                            Rooms &amp; Amenities
                        </Link>
                    </div>
                </header>
                {activeTab === "booking" && (
                    <section
                        className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm"
                        style={{ borderColor: "var(--color-border)" }}>
                        <div
                            className="border-b px-5 py-5 sm:px-6"
                            style={{ borderColor: "var(--color-border)" }}>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <p
                                        className="mt-1 text-sm"
                                        style={{ color: "var(--color-muted)" }}>
                                        Booking creation, status changes, payments,
                                        refunds, and rescheduling.
                                    </p>
                                </div>
                                <span
                                    className="text-sm"
                                    style={{ color: "var(--color-muted)" }}>
                                    {bookingTotal} records
                                </span>
                            </div>

                            <form
                                method="GET"
                                action="/admin/activities"
                                className="mt-4 flex flex-col gap-2 sm:flex-row">
                                <input
                                    name="bookingSearch"
                                    defaultValue={bookingSearch}
                                    maxLength={50}
                                    placeholder="Search booking reference or guest name"
                                    className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700"
                                    style={{ borderColor: "var(--color-border)" }}
                                />
                                <button
                                    type="submit"
                                    className="rounded-lg px-4 py-2 text-sm font-semibold text-white hover: cursor-pointer"
                                    style={{ backgroundColor: "var(--color-forest-700)" }}>
                                    Search
                                </button>
                            </form>
                        </div>

                        {bookingLogs.length ? (
                            <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                                {bookingLogs.map((log) => {
                                    const changes = getChanges(
                                        log.previous_data,
                                        log.new_data,
                                    );
                                    const newData = asRecord(log.new_data);
                                    const oldData = asRecord(log.previous_data);
                                    const bookingRef = String(
                                        newData.booking_ref ??
                                        oldData.booking_ref ??
                                        `Booking #${log.booking_id}`,
                                    );

                                    const guestName = bookingDetailsMap.get(log.booking_id) || "Not recorded";

                                    return (
                                        <article
                                            key={log.id}
                                            className="px-5 py-5 sm:px-6">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="flex min-w-0 items-start gap-3">
                                                    <div
                                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold"
                                                        style={getTypeStyles("booking")}>
                                                        B
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3
                                                            className="font-semibold"
                                                            style={{ color: "var(--color-forest-900)" }}>
                                                            {formatAction(log.action)}
                                                        </h3>
                                                        <p
                                                            className="mt-1 text-sm"
                                                            style={{ color: "var(--color-muted)" }}>
                                                            Booking Reference: {bookingRef}
                                                        </p>
                                                        <p
                                                            className="mt-1 text-sm"
                                                            style={{ color: "var(--color-muted)" }}>
                                                            Guest Name: {guestName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <time
                                                        className="shrink-0 text-xs sm:text-right"
                                                        dateTime={log.createdAt.toISOString()}
                                                        style={{ color: "var(--color-muted)" }}>
                                                        {formatDate(log.createdAt)}
                                                    </time>
                                                    <p
                                                        className="mt-1 text-xs"
                                                        style={{ color: "var(--color-muted)" }}>
                                                        Performed by: {getActor(log.actor_type, log.admin)}
                                                    </p>
                                                </div>
                                            </div>

                                            {log.reason && (
                                                <p
                                                    className="mt-3 rounded-lg px-3 py-2 text-sm"
                                                    style={{
                                                        backgroundColor: "#f9fafb",
                                                        color: "var(--color-muted)",
                                                    }}>
                                                    Reason: {log.reason}
                                                </p>
                                            )}

                                            {changes.length > 0 && (
                                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                                    {changes.map((change) => (
                                                        <div
                                                            key={change.key}
                                                            className="rounded-lg border px-3 py-2"
                                                            style={{ borderColor: "var(--color-border)" }}>
                                                            <p
                                                                className="text-xs font-semibold"
                                                                style={{ color: "var(--color-muted)" }}>
                                                                {change.label}
                                                            </p>
                                                            <p className="mt-1 break-words text-sm">
                                                                <span style={{ color: "#b91c1c" }}>
                                                                    {change.oldValue}
                                                                </span>
                                                                <span className="mx-2" style={{ color: "var(--color-muted)" }}>
                                                                    →
                                                                </span>
                                                                <span style={{ color: "var(--color-forest-500)" }}>
                                                                    {change.newValue}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="px-6 py-10 text-center">
                                <p className="font-medium" style={{ color: "var(--color-forest-900)" }}>
                                    No booking activity found
                                </p>
                                <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
                                    Try a different reference or guest name.
                                </p>
                            </div>
                        )}

                        <Pagination
                            feed="booking"
                            search={bookingSearch}
                            page={bookingPage}
                            totalPages={bookingTotalPages}
                        />
                    </section>
                )}
                {activeTab === "catalog" && (
                    <section
                        className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm"
                        style={{ borderColor: "var(--color-border)" }}>
                        <div
                            className="border-b px-5 py-5 sm:px-6"
                            style={{ borderColor: "var(--color-border)" }}>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <p
                                        className="mt-1 text-sm"
                                        style={{ color: "var(--color-muted)" }}>
                                        Rooms &amp; Amenities creation, edits, deletions, and field changes.
                                    </p>
                                </div>
                                <span
                                    className="text-sm"
                                    style={{ color: "var(--color-muted)" }}>
                                    {catalogTotal} records
                                </span>
                            </div>

                            <form
                                method="GET"
                                action="/admin/activities"
                                className="mt-4 flex flex-col gap-2 sm:flex-row">
                                <input
                                    name="catalogSearch"
                                    defaultValue={catalogSearch}
                                    maxLength={100}
                                    placeholder="Search room or amenity name"
                                    className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700"
                                    style={{ borderColor: "var(--color-border)" }}
                                />
                                <button
                                    type="submit"
                                    className="rounded-lg px-4 py-2 text-sm font-semibold text-white hover: cursor-pointer"
                                    style={{ backgroundColor: "var(--color-forest-700)" }}>
                                    Search
                                </button>
                            </form>
                        </div>

                        {catalogLogs.length ? (
                            <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                                {catalogLogs.map((log) => {
                                    const type = log.entity_type.toUpperCase() === "AMENITY"
                                        ? "amenity"
                                        : "room";
                                    const changes = getChanges(
                                        log.previous_data,
                                        log.new_data,
                                    );

                                    return (
                                        <article
                                            key={log.id}
                                            className="px-5 py-5 sm:px-6">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="flex min-w-0 items-start gap-3">
                                                    <div
                                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold"
                                                        style={getTypeStyles(type)}>
                                                        {type === "room" ? "R" : "A"}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3
                                                            className="font-semibold"
                                                            style={{ color: "var(--color-forest-900)" }}>
                                                            {formatAction(log.action)}
                                                        </h3>
                                                        <p
                                                            className="mt-1 text-sm"
                                                            style={{ color: "var(--color-muted)" }}>
                                                            {type === "room" ? "Room" : "Amenity"}: {log.entity_name}
                                                        </p>
                                                        <p
                                                            className="mt-1 text-xs"
                                                            style={{ color: "var(--color-muted)" }}>
                                                            Performed by: {getActor(log.actor_type)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <time
                                                    className="shrink-0 text-xs sm:text-right"
                                                    dateTime={log.createdAt.toISOString()}
                                                    style={{ color: "var(--color-muted)" }}>
                                                    {formatDate(log.createdAt)}
                                                </time>
                                            </div>

                                            {changes.length > 0 && (
                                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                                    {changes.map((change) => (
                                                        <div
                                                            key={change.key}
                                                            className="rounded-lg border px-3 py-2"
                                                            style={{ borderColor: "var(--color-border)" }}>
                                                            <p
                                                                className="text-xs font-semibold"
                                                                style={{ color: "var(--color-muted)" }}>
                                                                {change.label}
                                                            </p>
                                                            <p className="mt-1 break-words text-sm">
                                                                <span style={{ color: "#b91c1c" }}>
                                                                    {change.oldValue}
                                                                </span>
                                                                <span className="mx-2" style={{ color: "var(--color-muted)" }}>
                                                                    →
                                                                </span>
                                                                <span style={{ color: "var(--color-forest-800)" }}>
                                                                    {change.newValue}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="px-6 py-10 text-center">
                                <p className="font-medium" style={{ color: "var(--color-forest-900)" }}>
                                    No room or amenity activity found
                                </p>
                                <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
                                    Try a different record name.
                                </p>
                            </div>
                        )}

                        <Pagination
                            feed="catalog"
                            search={catalogSearch}
                            page={catalogPage}
                            totalPages={catalogTotalPages}
                        />
                    </section>
                )}
            </div>
        </main >
    );
}