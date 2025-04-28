import { SessionProvider } from "@/app/(main)/providers/SessionProvider";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedBook - Healthcare Booking System",
  description:
    "Book medical appointments seamlessly. Connect with healthcare providers instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
