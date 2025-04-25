import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addDays, startOfDay, endOfDay } from 'date-fns';

export async function GET(
  request: Request,
  { params }: { params: { hospitalId: string; serviceId: string } }
) {
  try {
    const startDate = startOfDay(new Date());
    const endDate = endOfDay(addDays(startDate, 7));

    const timeSlots = await prisma.timeSlot.findMany({
      where: {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
        bookings: {
          none: {
            serviceId: params.serviceId,
            hospitalId: params.hospitalId,
          },
        },
        available: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time slots' },
      { status: 500 }
    );
  }
}
