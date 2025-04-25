import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

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
