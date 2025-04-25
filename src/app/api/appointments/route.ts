import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

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
 *     description: Creates a new appointment booking
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
 *               serviceId:
 *                 type: string
 *               timeSlot:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *           example:
 *             hospitalId: "clh2x0f4b0001qw3j1234567"
 *             serviceId: "clh2x0f4b0002qw3j1234567"
 *             timeSlot:
 *               id: "clh2x0f4b0003qw3j1234567"
 *     responses:
 *       200:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *             example:
 *               id: "clh2x0f4b0004qw3j1234567"
 *               hospitalId: "clh2x0f4b0001qw3j1234567"
 *               serviceId: "clh2x0f4b0002qw3j1234567"
 *               timeSlotId: "clh2x0f4b0003qw3j1234567"
 *               userId: "clh2x0f4b0000qw3j1234567"
 *               status: "confirmed"
 *               createdAt: "2024-01-20T10:30:00Z"
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hospital or service not found
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
          startTime: 'asc',
        },
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.hospitalId || !body.serviceId || !body.timeSlot) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate hospital exists
    const hospital = await prisma.hospital.findUnique({
      where: { id: body.hospitalId },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: 'Hospital not found' },
        { status: 404 }
      );
    }

    // Validate service exists and belongs to the hospital
    const service = await prisma.service.findFirst({
      where: {
        id: body.serviceId,
        hospitalId: body.hospitalId,
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found or does not belong to the hospital' },
        { status: 404 }
      );
    }

    // Create appointment using a transaction
    const appointment = await prisma.$transaction(async (tx) => {
      // Check if time slot is still available
      const timeSlot = await tx.timeSlot.findUnique({
        where: { 
          id: body.timeSlot.id,
          available: true,
        },
      });

      if (!timeSlot) {
        throw new Error('Time slot not available');
      }

      // Create the appointment
      const newAppointment = await tx.booking.create({
        data: {
          hospitalId: body.hospitalId,
          serviceId: body.serviceId,
          timeSlotId: body.timeSlot.id,
          userId: session.user?.id ?? '',
          status: 'confirmed'
        },
        include: {
          hospital: true,
          service: true,
          timeSlot: true
        }
      });

      // Update time slot availability
      await tx.timeSlot.update({
        where: { id: body.timeSlot.id },
        data: { available: false }
      });

      return newAppointment;
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
