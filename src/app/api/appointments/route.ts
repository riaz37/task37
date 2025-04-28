import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get user appointments
 *     description: Retrieves all appointments for the authenticated user
 *     tags: [Appointments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create new appointment
 *     description: Creates a new appointment booking with transaction-based time slot locking
 *     tags: [Appointments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hospitalId
 *               - serviceId
 *               - timeSlot
 *             properties:
 *               hospitalId:
 *                 type: string
 *                 description: ID of the hospital
 *               serviceId:
 *                 type: string
 *                 description: ID of the service
 *               timeSlot:
 *                 type: object
 *                 required:
 *                   - id
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID of the time slot
 *     responses:
 *       200:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid request or missing fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hospital, service, or time slot not found
 *       409:
 *         description: Time slot no longer available
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appointments = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        hospital: true,
        service: true,
        timeSlot: true,
      },
      orderBy: {
        timeSlot: {
          startTime: "asc",
        },
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.hospitalId || !body.serviceId || !body.timeSlot) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create appointment
    const appointment = await prisma.$transaction(
      async (tx) => {
        // Check if time slot is still available and lock it
        const timeSlot = await tx.timeSlot.findUnique({
          where: {
            id: body.timeSlot.id,
          },
          select: {
            id: true,
            available: true,
          },
        });

        if (!timeSlot || !timeSlot.available) {
          throw new Error("Time slot not available");
        }

        // Validate hospital and service in parallel
        const [hospital, service] = await Promise.all([
          tx.hospital.findUnique({
            where: { id: body.hospitalId },
            select: { id: true },
          }),
          tx.service.findFirst({
            where: {
              id: body.serviceId,
              hospitalId: body.hospitalId,
            },
            select: { id: true },
          }),
        ]);

        if (!hospital) {
          throw new Error("Hospital not found");
        }

        if (!service) {
          throw new Error(
            "Service not found or does not belong to the hospital"
          );
        }

        // Create the appointment and update time slot in parallel
        const [newAppointment] = await Promise.all([
          tx.booking.create({
            data: {
              hospitalId: body.hospitalId,
              serviceId: body.serviceId,
              timeSlotId: body.timeSlot.id,
              userId: session.user?.id ?? "",
              status: "confirmed",
            },
            include: {
              hospital: true,
              service: true,
              timeSlot: true,
            },
          }),
          tx.timeSlot.update({
            where: { id: body.timeSlot.id },
            data: { available: false },
          }),
        ]);

        return newAppointment;
      },
      {
        timeout: 10000,
        isolationLevel: "Serializable", // Ensure data consistency
      }
    );

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);

    // Improved error handling
    if (error instanceof Error) {
      const status = error.message.includes("not found")
        ? 404
        : error.message.includes("not available")
          ? 409
          : 500;

      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
