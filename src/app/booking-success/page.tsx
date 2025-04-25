"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">
              Booking Confirmed!
            </h1>
            <p className="text-muted">
              Your appointment has been successfully scheduled
              {formattedDate && (
                <span className="block font-medium text-foreground mt-2">
                  for {formattedDate}
                </span>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 space-y-4">
            <Link
              href="/appointments"
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              View My Appointments
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            <Link
              href="/hospitals"
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-foreground hover:bg-gray-50 transition-colors"
            >
              Book Another Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center">
        <p className="text-muted">
          Need help?{" "}
          <Link href="/contact" className="text-primary hover:text-primary/90">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
