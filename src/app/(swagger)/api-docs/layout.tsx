import "swagger-ui-react/swagger-ui.css";

export const metadata = {
  title: "MedBook API Documentation",
  description: "API documentation for the MedBook Healthcare Booking System",
};

export default function SwaggerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: 'white' }}>
        {children}
      </body>
    </html>
  );
}