import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";
import { formatTime } from "@/lib/time";
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

function formatAction(
    action: string,
    entityType?: string,
): string {
    const labels: Record<string, string> = {
        BOOKING_CREATED: "New Booking",
        BOOKING_CANCELLED: "Booking Cancelled",
        BOOKING_CHECKED_IN: "Guest Checked In",
        BOOKING_COMPLETED: "Stay Completed",
        BOOKING_RESCHEDULED: "Booking Rescheduled",
        MANUAL_BOOKING_OVERRIDE: "Booking Manually Adjusted",
        PAYMENT_CONFIRMED: "Payment Received",
        PAYMENT_REFUNDED: "Payment Refunded",
        PAYMENT_REFUND_SUCCEEDED: "Refund Completed",
        PAYMENT_REFUND_FAILED: "Refund Failed",
        ROOM_CREATED: "Room Created",
        ROOM_UPDATED: "Room Updated",
        ROOM_DELETED: "Room Deleted",
        AMENITY_CREATED: "Amenity Created",
        AMENITY_UPDATED: "Amenity Updated",
        AMENITY_DELETED: "Amenity Deleted",
    };

    const normalizedAction = action.trim().toUpperCase();
    const normalizedEntity = entityType?.trim().toUpperCase();

    if (labels[normalizedAction]) {
        return labels[normalizedAction];
    }

    const entityLabel = normalizedEntity === "AMENITY" ? "Amenity" : "Room";

    const genericActions: Record<string, string> = {
        CREATE: "Created",
        CREATED: "Created",
        UPDATE: "Updated",
        UPDATED: "Updated",
        DELETE: "Deleted",
        DELETED: "Deleted",
    };

    if (genericActions[normalizedAction]) {
        return `${entityLabel} ${genericActions[normalizedAction]}`;
    }
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
        if (/^(checkInTime|checkOutTime|check_in_time|check_out_time)$/i.test(field)) {
            return formatTime(value);
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
    totalRecords,
}: {
    feed: "booking" | "catalog";
    search: string;
    page: number;
    totalPages: number;
    totalRecords: number;
}) {
    const start = totalRecords === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, totalRecords);
    return (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                Showing {start}–{end} of {totalRecords}{" "}
                {feed === "booking" ? "activities" : "activities"}
            </p>

            <div className="flex items-center gap-2">
                <Link
                    href={paginationHref(feed, search, page - 1)}
                    aria-disabled={page <= 1}
                    tabIndex={page <= 1 ? -1 : undefined}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium ${page <= 1 ? "pointer-events-none opacity-40" : "bg-gray-50"}`}
                    style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-forest-800)",
                    }}>
                    Previous
                </Link>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (pageNumber) => (
                        <Link
                            key={pageNumber}
                            href={paginationHref(feed, search, pageNumber)}
                            aria-current={page === pageNumber ? "page" : undefined}
                            className="rounded-lg border px-3 py-2 text-sm font-medium"
                            style={{
                                borderColor: page === pageNumber ? "var(--color-forest-500)" : "var(--color-border)",
                                backgroundColor: page === pageNumber ? "var(--color-forest-100)" : "white",
                                color: page === pageNumber ? "var(--color-forest-900)" : "var(--color-muted)",
                            }}>
                            {pageNumber}
                        </Link>
                    ),
                )}

                <Link
                    href={paginationHref(feed, search, page + 1)}
                    aria-disabled={page >= totalPages}
                    tabIndex={page >= totalPages ? -1 : undefined}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium ${page >= totalPages ? "pointer-events-none opacity-40" : "bg-gray-50"}`}
                    style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-forest-800)",
                    }}>
                    Next
                </Link>
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

    const bookingWhere: Prisma.BookingAuditLogWhereInput = {
        action: {
            notIn: ["BOOKING_CREATED", "PAYMENT_CONFIRMED"],
        },
        ...(bookingSearch
            ? {
                booking_id: {
                    in: matchingBookings!.map((booking) => booking.id),
                },
            }
            : {}),
    };

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
            booking_ref: true,
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
    const bookingReferenceMap = new Map(
        bookingDetails.map((booking) => [
            booking.id,
            booking.booking_ref,
        ]),
    );
    const catalogActorIds = [
        ...new Set(
            catalogLogs
                .map((log) => log.actor_user_id)
                .filter((id): id is number => id !== null),
        ),
    ];

    const catalogActors = await prisma.user.findMany({
        where: {
            id: { in: catalogActorIds },
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    const catalogActorMap = new Map(
        catalogActors.map((user) => [
            user.id,
            user.name?.trim() || user.email,
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
                    <>
                        <form
                            method="GET"
                            action="/admin/activities"
                            className="mt-8 flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm lg:flex-row"
                            style={{ borderColor: "var(--color-border)" }}>
                            <input type="hidden" name="tab" value="booking" />

                            <label htmlFor="booking-search" className="sr-only">
                                Search bookings by guest name or reference number
                            </label>

                            <input
                                id="booking-search"
                                type="search"
                                name="bookingSearch"
                                defaultValue={bookingSearch}
                                maxLength={50}
                                placeholder="Search by guest name or booking reference..."
                                autoComplete="off"
                                className="w-full min-w-0 flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                                style={{ borderColor: "var(--color-border)" }}
                            />

                            <button
                                type="submit"
                                className="rounded-lg px-4 py-2.5 text-sm font-medium text-white hover:cursor-pointer"
                                style={{ backgroundColor: "var(--color-forest-700)" }}>
                                Search
                            </button>
                        </form>
                        <section className="mt-6">
                            <div className="">
                                <Pagination
                                    feed="booking"
                                    search={bookingSearch}
                                    page={bookingPage}
                                    totalPages={bookingTotalPages}
                                    totalRecords={bookingTotal}
                                />
                            </div>
                            {bookingLogs.length ? (
                                <div className="mt-3 flex flex-col gap-4">
                                    {bookingLogs.map((log) => {
                                        const changes = getChanges(
                                            log.previous_data,
                                            log.new_data,
                                        );
                                        const newData = asRecord(log.new_data);
                                        const oldData = asRecord(log.previous_data);
                                        const bookingRef = String(newData.booking_ref ?? oldData.booking_ref ?? bookingReferenceMap.get(log.booking_id) ?? `Booking #${log.booking_id}`,);
                                        const guestName = bookingDetailsMap.get(log.booking_id) || "Not recorded";
                                        return (
                                            <article
                                                key={log.id}
                                                className="rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:px-6"
                                                style={{ borderColor: "var(--color-border)" }}>
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
                        </section>
                    </>
                )}
                {activeTab === "catalog" && (
                    <section className="mt-8">
                        <div>
                            <form
                                method="GET"
                                action="/admin/activities"
                                className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm lg:flex-row"
                                style={{ borderColor: "var(--color-border)" }}>
                                <input type="hidden" name="tab" value="catalog" />

                                <label htmlFor="catalog-search" className="sr-only">
                                    Search rooms and amenities by name
                                </label>

                                <input
                                    id="catalog-search"
                                    type="search"
                                    name="catalogSearch"
                                    defaultValue={catalogSearch}
                                    maxLength={100}
                                    placeholder="Search room or amenity name"
                                    autoComplete="off"
                                    className="w-full min-w-0 flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-forest-500)]"
                                    style={{ borderColor: "var(--color-border)" }}
                                />
                                <button
                                    type="submit"
                                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-white hover:cursor-pointer"
                                    style={{ backgroundColor: "var(--color-forest-700)" }}>
                                    Search
                                </button>
                            </form>
                        </div>

                        <section className="mt-6">
                            <Pagination
                                feed="catalog"
                                search={catalogSearch}
                                page={catalogPage}
                                totalPages={catalogTotalPages}
                                totalRecords={catalogTotal}
                            />

                            {catalogLogs.length ? (
                                <div className="mt-3 flex flex-col gap-4">
                                    {catalogLogs.map((log) => {
                                        const type = log.entity_type.toUpperCase() === "AMENITY" ? "amenity" : "room";
                                        const changes = getChanges(log.previous_data, log.new_data,);

                                        return (
                                            <article
                                                key={log.id}
                                                className="rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:px-6"
                                                style={{ borderColor: "var(--color-border)" }}>
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
                                                                {formatAction(log.action, log.entity_type)}
                                                            </h3>
                                                            <p
                                                                className="mt-1 text-sm"
                                                                style={{ color: "var(--color-muted)" }}>
                                                                {type === "room" ? "Room" : "Amenity"}: {log.entity_name}
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
                                                            Performed by: {log.actor_user_id !== null
                                                                ? catalogActorMap.get(log.actor_user_id) ?? getActor(log.actor_type)
                                                                : getActor(log.actor_type)}
                                                        </p>
                                                    </div>
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
                                <div
                                    className="mt-3 rounded-xl border bg-white px-6 py-10 text-center"
                                    style={{ borderColor: "var(--color-border)" }}>
                                    <p
                                        className="font-medium"
                                        style={{ color: "var(--color-forest-900)" }}>
                                        No room or amenity activity found
                                    </p>
                                    <p
                                        className="mt-1 text-sm"
                                        style={{ color: "var(--color-muted)" }}>
                                        Try a different record name.
                                    </p>
                                </div>
                            )}
                        </section>
                    </section>
                )}
            </div>
        </main>
    );
}