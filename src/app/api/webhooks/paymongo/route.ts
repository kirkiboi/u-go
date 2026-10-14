
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function verifyPayMongoSignature(
    rawBody: string,
    signatureHeader: string | null,
    webhookSecret: string,
    isLiveMode: boolean
): boolean {
    if (!signatureHeader) return false;
    const parts: Record<string, string> = {};
    for (const part of signatureHeader.split(",")) {
        const separator = part.indexOf("=");
        if (separator === -1) continue;
        parts[part.slice(0, separator).trim()] =
            part.slice(separator + 1).trim();
    }

    const timestamp = parts.t;
    const receivedSignature = isLiveMode ? parts.li : parts.te;
    if (!timestamp || !receivedSignature) return false;
    const expectedSignature = createHmac("sha256", webhookSecret)
        .update(`${timestamp}.${rawBody}`)
        .digest("hex");
    const expected = Buffer.from(expectedSignature, "hex");
    const received = Buffer.from(receivedSignature, "hex");

    return (
        expected.length === received.length &&
        timingSafeEqual(expected, received)
    );
}

export async function POST(request: Request) {
    const rawBody = await request.text();
    const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("PAYMONGO_WEBHOOK_SECRET is not configured.");
        return NextResponse.json(
            { error: "Webhook configuration is missing." },
            { status: 500 }
        );
    }

    let event: any;

    try {
        event = JSON.parse(rawBody);
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON payload." },
            { status: 400 }
        );
    }
    const eventAttributes = event?.data?.attributes;
    const isLiveMode = eventAttributes?.livemode === true;
    const validSignature = verifyPayMongoSignature(
        rawBody,
        request.headers.get("paymongo-signature"),
        webhookSecret,
        isLiveMode
    );
    if (!validSignature) {
        return NextResponse.json(
            { error: "Invalid webhook signature." },
            { status: 401 }
        );
    }
    if (eventAttributes?.type !== "checkout_session.payment.paid") {
        return NextResponse.json({ received: true }, { status: 200 });
    }

    const session = eventAttributes.data;
    const sessionId = session?.id;
    const attributes = session?.attributes;
    const bookingRef = attributes?.reference_number;
    const payments = attributes?.payments;

    if (
        typeof sessionId !== "string" ||
        typeof bookingRef !== "string" ||
        !Array.isArray(payments)
    ) {
        return NextResponse.json(
            { error: "Invalid checkout session data." },
            { status: 400 }
        );
    }
    try {
        const booking = await prisma.booking.findFirst({
            where: {
                booking_ref: bookingRef,
                paymongo_session_id: sessionId,
            },
        });
        if (!booking) {
            console.error("No booking matches the paid checkout session.", {
                bookingRef,
                sessionId,
            });
            return NextResponse.json(
                { error: "Booking not found for this payment." },
                { status: 404 }
            );
        }
        if (
            booking.status === "CONFIRMED" &&
            booking.payment_status === "PAID"
        ) {
            return NextResponse.json(
                { received: true, alreadyProcessed: true },
                { status: 200 }
            );
        }

        const paidPayment = payments.find(
            (payment: any) =>
                payment?.attributes?.status === "paid"
        );
        if (!paidPayment) {
            return NextResponse.json(
                { error: "No paid payment was found." },
                { status: 400 }
            );
        }

        const paidAttributes = paidPayment.attributes;
        const expectedAmount = booking.total * 100;
        const paidAmount = paidAttributes?.amount;
        const paidCurrency = paidAttributes?.currency;
        if (
            paidAmount !== expectedAmount ||
            typeof paidCurrency !== "string" ||
            paidCurrency.toUpperCase() !== "PHP"
        ) {
            console.error("Payment amount or currency mismatch.", {
                bookingRef,
                expectedAmount,
                paidAmount,
                paidCurrency,
            });
            return NextResponse.json(
                { received: true, requiresReview: true },
                { status: 200 }
            );
        }

        if (
            booking.status !== "PENDING" ||
            booking.payment_status !== "PENDING" ||
            (booking.payment_expires_at !== null &&
                booking.payment_expires_at < new Date())
        ) {
            console.error("Paid event received for an ineligible booking.", {
                bookingRef,
                status: booking.status,
                paymentStatus: booking.payment_status,
            });
            return NextResponse.json(
                { received: true, requiresReview: true },
                { status: 200 }
            );
        }
        await prisma.booking.update({
            where: { id: booking.id },
            data: {
                status: "CONFIRMED",
                payment_status: "PAID",
            },
        });
        return NextResponse.json(
            {
                received: true,
                bookingRef,
                status: "CONFIRMED",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("PayMongo webhook processing failed:", error);
        return NextResponse.json(
            { error: "Unable to process payment webhook." },
            { status: 500 }
        );
    }
}