import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ConfirmationPageProps = {
    searchParams: Promise<{ ref?: string }>;
};

export default async function BookingConfirmationPage({
    searchParams,
}: ConfirmationPageProps) {
    const { ref } = await searchParams;
    const booking =
        typeof ref === "string" && ref.length <= 64
            ? await prisma.booking.findUnique({
                where: { booking_ref: ref },
                select: {
                    booking_ref: true,
                    status: true,
                    payment_status: true,
                    check_in: true,
                    check_out: true,
                },
            })
            : null;
    const isConfirmed =
        booking?.status === "CONFIRMED" &&
        booking?.payment_status === "PAID";
    const isCancelled =
        booking?.status === "CANCELLED" ||
        booking?.payment_status === "FAILED";

    return (
        <main className="min-h-screen px-4 py-24 sm:px-6">
            <section className="mx-auto max-w-2xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8 text-center shadow-sm sm:p-12">
                {isConfirmed ? (
                    <>
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
                            ✓
                        </div>
                        <h1 className="text-3xl font-bold">
                            Booking Confirmed!
                        </h1>
                        <p className="mt-4 text-[var(--color-muted)]">
                            Thank you for choosing U-GO Mountain Resort.
                            Your payment has been verified, and your
                            booking is confirmed. You will also be receiving an email confirmation from us.
                        </p>

                        <div className="mt-8 rounded-xl border border-[var(--color-border)] p-5 text-left">
                            <p className="text-sm text-[var(--color-muted)]">
                                Booking Reference
                            </p>
                            <p className="mt-1 break-all text-lg font-semibold">
                                {booking.booking_ref}
                            </p>
                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-[var(--color-muted)]">
                                        Check-in
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {booking.check_in.toLocaleDateString(
                                            "en-PH",
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                timeZone: "UTC",
                                            }
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--color-muted)]">
                                        Check-out
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {booking.check_out.toLocaleDateString(
                                            "en-PH",
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                timeZone: "UTC",
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : isCancelled ? (
                    <>
                        <h1 className="text-3xl font-bold">
                            Booking Not Completed
                        </h1>
                        <p className="mt-4 text-[var(--color-muted)]">
                            This booking was cancelled or its payment
                            failed. Please contact the resort if you
                            believe you have already paid.
                        </p>
                    </>
                ) : booking ? (
                    <>
                        <h1 className="text-3xl font-bold">
                            Payment Processing
                        </h1>
                        <p className="mt-4 text-[var(--color-muted)]">
                            We received your return from checkout, but
                            your payment has not yet been confirmed.
                            Please refresh this page in a moment.
                        </p>
                        <p className="mt-5 text-sm">
                            Booking Reference:{" "}
                            <span className="font-semibold">
                                {booking.booking_ref}
                            </span>
                        </p>
                        <Link
                            href={`/booking/confirmation?ref=${encodeURIComponent(
                                booking.booking_ref
                            )}`}
                            className="mt-6 inline-flex rounded-lg border border-[var(--color-border)] px-5 py-3 font-medium transition hover:opacity-80">
                            Refresh payment status
                        </Link>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold">
                            Booking Not Found
                        </h1>
                        <p className="mt-4 text-[var(--color-muted)]">
                            We could not find a booking for this reference.
                            Please check the link or contact the resort.
                        </p>
                    </>
                )}
                <Link
                    href="/"
                    className="mt-8 inline-block text-sm font-medium underline underline-offset-4">
                    Return to Website
                </Link>
            </section>
        </main>
    );
}