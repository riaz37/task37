import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    // Clean the database (only if tables exist)
    const tableNames = ['Booking', 'TimeSlot', 'Service', 'Hospital', 'User'];
    
    for (const tableName of tableNames) {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tableName}" CASCADE;`);
      } catch (error) {
        console.log(`Table ${tableName} might not exist yet, continuing...`);
      }
    }

    // Create demo user
    const demoUser = await prisma.user.create({
      data: {
        email: "demo@example.com",
        password: await hash("password123", 12),
      },
    });

    console.log("Created demo user:", demoUser.email);

    // // First create hospitals
    const hospitals = await prisma.hospital.createMany({
      data: [
        {
          name: "General Hospital",
          address: "123 Main Street",
          phone: "555-0123",
        },
        {
          name: "City Medical Center",
          address: "456 Park Avenue",
          phone: "555-0456",
        },
        {
          name: "Community Hospital",
          address: "789 Oak Road",
          phone: "555-0789",
        },
      ],
    });

    // Get the created hospitals for reference
    const createdHospitals = await prisma.hospital.findMany();
    console.log("Created hospitals:", createdHospitals.length);

    // Create services for each hospital
    for (const hospital of createdHospitals) {
      await prisma.service.createMany({
        data: [
          {
            hospitalId: hospital.id,
            name: "General Check-up",
            description: "Complete physical examination",
            duration: 30,
            price: 100,
          },
          {
            hospitalId: hospital.id,
            name: "Blood Test",
            description: "Complete blood count and analysis",
            duration: 15,
            price: 75,
          },
          {
            hospitalId: hospital.id,
            name: "X-Ray",
            description: "Chest X-ray examination",
            duration: 20,
            price: 150,
          },
        ],
      });
    }

    // Create time slots for the next 7 days
    const now = new Date();
    const timeSlots = [];

    for (let day = 0; day < 7; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);

      // Create slots from 9 AM to 5 PM
      for (let hour = 9; hour < 17; hour++) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);
        const endTime = new Date(startTime);
        endTime.setHours(hour + 1, 0, 0, 0);

        timeSlots.push({
          startTime,
          endTime,
          available: Math.random() > 0.3, // 70% chance of being available
        });
      }
    }

    const createdTimeSlots = await prisma.timeSlot.createMany({
      data: timeSlots,
    });

    console.log("Created time slots:", createdTimeSlots.count);

    // Get all services for reference
    const services = await prisma.service.findMany();

    // Get available time slots for bookings
    const availableTimeSlots = await prisma.timeSlot.findMany({
      where: { available: true },
      take: 3, // Create 3 sample bookings
    });

    // Create sample bookings only if we have hospitals, services, and time slots
    if (
      createdHospitals.length > 0 &&
      services.length > 0 &&
      availableTimeSlots.length > 0
    ) {
      const bookings = await Promise.all(
        availableTimeSlots.map((timeSlot, index) =>
          prisma.booking.create({
            data: {
              hospitalId: createdHospitals[index % createdHospitals.length].id,
              serviceId: services[index % services.length].id,
              timeSlotId: timeSlot.id,
              userId: demoUser.id,
              status: "confirmed",
            },
          })
        )
      );

      console.log("Created bookings:", bookings.length);
    }
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
