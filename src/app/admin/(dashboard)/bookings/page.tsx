import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import BookingsList from "./bookingsList";

const BOOKINGS_PER_PAGE = 6;

type SearchParams = Promise<{
    page?: string | string[];
    search?: string | string[];
    status?: string | string[];
    date?: string | string[];
}>;

function getParam(value: string | string[] | undefined): string {
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getManilaDateKey(): string {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const year = parts.find((part) => part.type === "year")!.value;
    const month = parts.find((part) => part.type === "month")!.value;
    const day = parts.find((part) => part.type === "day")!.value;

    return `${year}-${month}-${day}`;
}

export default async function BookingsPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const params = await searchParams;

    const search = getParam(params.search).trim();
    const requestedPage = Number.parseInt(getParam(params.page) || "1", 10);
    const page = Number.isFinite(requestedPage)
        ? Math.max(1, requestedPage)
        : 1;

    const allowedStatuses = [
        "CONFIRMED",
        "PENDING",
        "CANCELLED",
        "COMPLETED",
        "CHECKED_IN",
        "all",
    ] as const;

    const requestedStatus = getParam(params.status) || "CONFIRMED";
    const status = allowedStatuses.includes(
        requestedStatus as (typeof allowedStatuses)[number],
    )
        ? requestedStatus
        : "CONFIRMED";

    const allowedDates = ["all", "upcoming", "today", "past"] as const;
    const requestedDate = getParam(params.date) || "all";
    const date = allowedDates.includes(
        requestedDate as (typeof allowedDates)[number],
    )
        ? requestedDate
        : "all";

    const where: Prisma.BookingWhereInput = {};

    if (status !== "all") {
        where.status = status as NonNullable<Prisma.BookingWhereInput["status"]>;
    }

    if (search) {
        const terms = search.split(/\s+/).filter(Boolean);

        where.OR = [
            {
                booking_ref: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                AND: terms.map((term) => ({
                    OR: [
                        {
                            guest_fname: {
                                contains: term,
                                mode: "insensitive",
                            },
                        },
                        {
                            guest_lname: {
                                contains: term,
                                mode: "insensitive",
                            },
                        },
                    ],
                })),
            },
        ];
    }

    if (date !== "all") {
        const todayKey = getManilaDateKey();
        const todayStart = new Date(`${todayKey}T00:00:00.000Z`);
        const tomorrowStart = new Date(
            todayStart.getTime() + 24 * 60 * 60 * 1000,
        );

        if (date === "upcoming") {
            where.check_in = { gte: tomorrowStart };
        } else if (date === "today") {
            where.check_in = {
                gte: todayStart,
                lt: tomorrowStart,
            };
        } else if (date === "past") {
            where.check_in = { lt: todayStart };
        }
    }

    const totalBookings = await prisma.booking.count({ where });
    const totalPages = Math.ceil(totalBookings / BOOKINGS_PER_PAGE);
    const currentPage = Math.min(page, Math.max(1, totalPages));

    const bookings = await prisma.booking.findMany({
        where,
        orderBy: {
            createdAt: "desc",
        },
        skip: (currentPage - 1) * BOOKINGS_PER_PAGE,
        take: BOOKINGS_PER_PAGE,
        include: {
            room: {
                select: {
                    name: true,
                },
            },
        },
    });

    return (
        <BookingsList
            bookings={bookings}
            search={search}
            statusFilter={status}
            dateFilter={date}
            currentPage={currentPage}
            totalPages={totalPages}
            totalBookings={totalBookings}
        />
    );
}