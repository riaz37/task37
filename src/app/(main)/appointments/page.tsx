"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";

interface Appointment {
  id: string;
  status: string;
  hospital: {
    id: string;
    name: string;
    address: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
  };
  timeSlot: {
    id: string;
    startTime: string;
    endTime: string;
  };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/appointments");
        if (!response.ok) throw new Error("Failed to fetch appointments");
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load appointments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-primary/10 text-primary";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              My Appointments
            </h1>
            <p className="mt-2 text-muted">
              Manage your upcoming medical appointments
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-foreground/10 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No appointments found
            </h3>
            <p className="text-muted mb-6">
              You haven&apos;t scheduled any appointments yet.
            </p>
            <a
              href="/hospitals"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
            >
              Book Your First Appointment
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-foreground/10 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground">
                        {appointment.service.name}
                      </h3>
                      <p className="text-muted">{appointment.hospital.name}</p>
                    </div>
                    <span
                      className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${getStatusStyles(appointment.status)}
                    `}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  </div>

                  <div className="border-t border-foreground/10 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted">Date & Time</p>
                        <p className="text-foreground">
                          {format(
                            new Date(appointment.timeSlot.startTime),
                            "EEEE, MMMM d, yyyy"
                          )}
                          <br />
                          {format(
                            new Date(appointment.timeSlot.startTime),
                            "h:mm a"
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted">Location</p>
                        <p className="text-foreground">
                          {appointment.hospital.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
