import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

async function getUpcomingAppointmentsCount(userId: string) {
  return await prisma.booking.count({
    where: {
      userId,
      timeSlot: {
        startTime: {
          gte: new Date(),
        },
      },
    },
  });
}

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  let upcomingAppointments = 0;
  try {
    upcomingAppointments = await getUpcomingAppointmentsCount(session.user.id!);
  } catch (error) {
    console.error("Error fetching appointments count:", error);
    // Handle error gracefully, but continue rendering the page
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/medical-logo.svg"
                alt="MedBook Logo"
                width={32}
                height={32}
              />
              <span className="font-bold text-xl text-foreground">MedBook</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-muted">{session.user.email}</span>
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  className="bg-primary/10 text-primary px-6 py-2 rounded-full text-sm font-medium hover:bg-primary/20 transition-all"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back{session.user.name ? `, ${session.user.name}` : ""}
          </h1>
          <p className="text-muted mt-2">
            Manage your healthcare journey from one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-foreground/10 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/hospitals"
                className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground">
                  Book Appointment
                </span>
              </Link>
              <Link
                href="/appointments"
                className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6 text-primary"
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
                <span className="text-sm font-medium text-foreground">
                  View Schedule
                </span>
              </Link>
            </div>
          </div>

          {/* Upcoming Appointments Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-foreground/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Upcoming Appointments
              </h2>
              <span className="text-3xl font-bold text-primary">
                {upcomingAppointments}
              </span>
            </div>
            <p className="text-muted mb-4">
              {upcomingAppointments === 0
                ? "No upcoming appointments scheduled"
                : upcomingAppointments === 1
                ? "You have 1 upcoming appointment"
                : `You have ${upcomingAppointments} upcoming appointments`}
            </p>
            <Link
              href="/appointments"
              className="inline-flex items-center text-sm text-primary hover:text-primary-hover"
            >
              <span>View all appointments</span>
              <svg
                className="ml-2 h-4 w-4"
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
          </div>
        </div>

        {/* Health Tips Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-foreground/10 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Health Tips & Reminders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="font-medium text-foreground">
                  Regular Check-ups
                </h3>
              </div>
              <p className="text-sm text-muted">
                Schedule regular check-ups to maintain your health
              </p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <h3 className="font-medium text-foreground">Stay Active</h3>
              </div>
              <p className="text-sm text-muted">
                Maintain an active lifestyle for better health
              </p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
                <h3 className="font-medium text-foreground">Rest Well</h3>
              </div>
              <p className="text-sm text-muted">
                Get adequate sleep for optimal health
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
