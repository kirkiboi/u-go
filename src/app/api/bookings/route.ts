import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { bookingRateLimit } from "@/lib/rateLimit";
import { NextResponse, type NextRequest } from "next/server";
import { getClientIp } from "@/lib/clientIP";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
    try {
        const clientIp = getClientIp(request);
        if (!clientIp) {
            return NextResponse.json(
                { error: "Unable to identify your connection." },
                { status: 503 }
            );
        }

        const { success, reset } = await bookingRateLimit.limit(clientIp);
        if (!success) {
            return NextResponse.json(
                {
                    error: "Too many booking attempts. Please try again later.",
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))),
                    },
                }
            );
        }
        const body = await request.json();
        const roomId = Number(body.roomId);
        const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
        const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const phone = typeof body.phone === "string" ? body.phone.trim() : "";
        const checkIn = typeof body.checkIn === "string" ? body.checkIn : "";
        const checkOut = typeof body.checkOut === "string" ? body.checkOut : "";
        const specialRequests = typeof body.specialRequests === "string" ? body.specialRequests.trim() : "";

        const validDate = (value: string): boolean => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
            const date = new Date(`${value}T00:00:00.000Z`);
            return (!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value);
        };

        if (!Number.isSafeInteger(roomId) || roomId < 1) {
            return NextResponse.json(
                { error: "Please select a valid accommodation." },
                { status: 400 }
            );
        }

        if (!firstName || !lastName || firstName.length > 100 || lastName.length > 100) {
            return NextResponse.json(
                { error: "Please provide valid first and last names." },
                { status: 400 }
            );
        }

        if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        if (!phone || phone.length > 30) {
            return NextResponse.json(
                { error: "Please provide a valid phone number." },
                { status: 400 }
            );
        }

        if (
            !validDate(checkIn) ||
            !validDate(checkOut) ||
            checkOut <= checkIn
        ) {
            return NextResponse.json(
                { error: "Please provide valid check-in and check-out dates." },
                { status: 400 }
            );
        }

        const todayInPhilippines = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date());

        if (checkIn <= todayInPhilippines) {
            return NextResponse.json(
                { error: "Check-in must be at least tomorrow." },
                { status: 400 }
            );
        }

        if (specialRequests.length > 2000) {
            return NextResponse.json(
                { error: "Special requests must not exceed 2000 characters." },
                { status: 400 }
            );
        }
        const checkInDate = new Date(`${checkIn}T00:00:00.000Z`);
        const checkOutDate = new Date(`${checkOut}T00:00:00.000Z`);
        const nights = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);
        const now = new Date();
        const paymentExpiresAt = new Date(now.getTime() + 10 * 60 * 1000);

        const booking = await prisma.$transaction(
            async (tx) => {
                const room = await tx.room.findUnique({
                    where: { id: roomId },
                    select: { id: true, price: true },
                });
                if (!room) {
                    throw new Error("ROOM_NOT_FOUND");
                }

                const overlappingBooking = await tx.booking.findFirst({
                    where: {
                        room_id: roomId,
                        check_in: { lt: checkOutDate },
                        check_out: { gt: checkInDate },
                        OR: [
                            { status: "CONFIRMED" },
                            {
                                status: "PENDING",
                                payment_status: "PENDING",
                                payment_expires_at: { gt: now },
                            },
                        ],
                    },
                    select: { id: true },
                });

                if (overlappingBooking) {
                    throw new Error("DATES_UNAVAILABLE");
                }
                const total = room.price * nights;

                if (!Number.isSafeInteger(total) || total <= 0) {
                    throw new Error("INVALID_BOOKING_TOTAL");
                }

                return tx.booking.create({
                    data: {
                        booking_ref: `UGO-${randomUUID()
                            .replaceAll("-", "")
                            .slice(0, 12)
                            .toUpperCase()}`,
                        room_id: room.id,
                        guest_fname: firstName,
                        guest_lname: lastName,
                        guest_email: email,
                        guest_phone: phone,
                        check_in: checkInDate,
                        check_out: checkOutDate,
                        room_price: room.price,
                        total,
                        status: "PENDING",
                        payment_status: "PENDING",
                        special_req: specialRequests || null,
                        payment_expires_at: paymentExpiresAt,
                    },
                });
            },
            {
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            }
        );

        const secretKey = process.env.PAYMONGO_SECRET_KEY;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;

        if (!secretKey || !appUrl) {
            return NextResponse.json(
                { error: "Payment configuration is missing." },
                { status: 500 }
            );
        }

        try {
            const checkoutResponse = await fetch(
                "https://api.paymongo.com/v2/checkout_sessions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Basic ${Buffer.from(
                            `${secretKey}:`
                        ).toString("base64")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        data: {
                            attributes: {
                                line_items: [
                                    {
                                        name: "U-GO Mountain Resort Accommodation",
                                        amount: booking.total * 100,
                                        currency: "PHP",
                                        quantity: 1,
                                    },
                                ],
                                payment_method_types: [
                                    "gcash",
                                    "qrph",
                                    "card",
                                ],
                                description: `Accommodation booking ${booking.booking_ref}`,
                                reference_number: booking.booking_ref,
                                success_url: `${appUrl}/booking/confirmation?ref=${booking.booking_ref}`,
                                cancel_url: `${appUrl}/booking?payment=cancelled&ref=${booking.booking_ref}`,
                                send_email_receipt: true,
                            },
                        },
                    }),
                }
            );

            const checkoutResult = await checkoutResponse.json();
            const checkoutSessionId = checkoutResult?.data?.id;
            const checkoutUrl = checkoutResult?.data?.attributes?.checkout_url;

            if (!checkoutResponse.ok || typeof checkoutSessionId !== "string" || typeof checkoutUrl !== "string") {
                console.error("PayMongo checkout creation failed:", checkoutResult);
                try {
                    await prisma.booking.update({
                        where: { id: booking.id },
                        data: {
                            status: "CANCELLED",
                            payment_status: "FAILED",
                            payment_expires_at: new Date(),
                        },
                    });
                } catch (cleanupError) {
                    console.error(`CRITICAL: Failed to cleanup booking ${booking.id} after PayMongo rejection:`, cleanupError);
                }
                return NextResponse.json(
                    { error: "Payment gateway error. Please try again." },
                    { status: 502 }
                );
            }

            await prisma.booking.update({
                where: { id: booking.id },
                data: {
                    paymongo_session_id: checkoutSessionId,
                },
            });

            return NextResponse.json(
                {
                    message: "Booking created. Continue to payment.",
                    booking: {
                        bookingRef: booking.booking_ref,
                        total: booking.total,
                        checkIn,
                        checkOut,
                        paymentExpiresAt: booking.payment_expires_at,
                    },
                    checkoutUrl,
                },
                { status: 201 }
            );
        } catch (paymentError) {
            console.error(
                "PayMongo checkout request failed; booking left pending until expiry:",
                {
                    bookingRef: booking.booking_ref,
                    error: paymentError,
                }
            );
            return NextResponse.json(
                { error: "Unable to initialize payment. Please try again." },
                { status: 502 }
            );
        }
    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: "Invalid request body." },
                { status: 400 }
            );
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
            return NextResponse.json(
                { error: "Another booking was being processed for this accommodation. Please try again.", },
                { status: 409 }
            );
        }
        if (error instanceof Error) {
            if (error.message === "ROOM_NOT_FOUND") {
                return NextResponse.json(
                    { error: "The selected accommodation was not found." },
                    { status: 404 }
                );
            }
            if (error.message === "DATES_UNAVAILABLE") {
                return NextResponse.json(
                    { error: "This accommodation is unavailable for the selected dates.", },
                    { status: 409 }
                );
            }
            if (error.message === "INVALID_BOOKING_TOTAL") {
                return NextResponse.json(
                    { error: "Unable to calculate the booking total." },
                    { status: 400 }
                );
            }
        }
        console.error("Unexpected error in POST /api/bookings:", error);
        return NextResponse.json(
            { error: "Something went wrong while creating your booking." },
            { status: 500 }
        );
    }
}