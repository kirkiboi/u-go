import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";
import RefundForm from "./RefundForm";

export default async function RefundPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    try {
        await requireAdmin();
    } catch {
        redirect("/admin/login");
    }

    const { id } = await params;
    const bookingId = Number(id);

    if (!Number.isSafeInteger(bookingId) || bookingId < 1) {
        notFound();
    }

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: {
            id: true,
            booking_ref: true,
            guest_fname: true,
            guest_lname: true,
            total: true,
            status: true,
            payment_status: true,
            paymongo_payment_id: true,
            paymongo_refund_id: true,
            paymongo_refund_status: true,
            paymongo_refund_reason: true,
        },
    });

    if (!booking) {
        notFound();
    }

    return (
        <main className="mx-auto max-w-3xl space-y-8 p-6">
            <header>
                <Link
                    href={`/admin/bookings/${booking.id}/manual`}
                    className="text-sm text-stone-600 hover:text-stone-900 hover:underline">
                    ← Back to manual booking actions
                </Link>

                <h1 className="mt-4 text-2xl font-bold text-stone-900">
                    Refund Payment
                </h1>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                    Review the payment details carefully before submitting
                    a full refund. This action sends a refund request to
                    PayMongo.
                </p>
            </header>

            <RefundForm
                bookingId={booking.id}
                bookingRef={booking.booking_ref}
                guestName={`${booking.guest_fname} ${booking.guest_lname}`}
                amount={booking.total}
                bookingStatus={booking.status}
                paymentStatus={booking.payment_status}
                paymentId={booking.paymongo_payment_id}
                refundId={booking.paymongo_refund_id}
                initialRefundStatus={booking.paymongo_refund_status}
                existingRefundReason={booking.paymongo_refund_reason}
            />
        </main>
    );
}