import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addDays, startOfDay, endOfDay } from "date-fns";

/**
 * @swagger
 * /api/hospitals/{hospitalId}/services/{serviceId}/time-slots:
 *   get:
 *     summary: Get available time slots for a specific service at a hospital
 *     tags: [TimeSlots]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hospitalId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the hospital
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the service
 *     responses:
 *       200:
 *         description: List of available time slots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                   available:
 *                     type: boolean
 *       404:
 *         description: Hospital or service not found
 *       500:
 *         description: Server error
 */

type Params = Promise<{ hospitalId: string; serviceId: string }>;
export async function GET(request: Request, { params }: { params: Params }) {
  const { hospitalId, serviceId } = await params;

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
            serviceId,
            hospitalId,
          },
        },
        available: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch time slots" },
      { status: 500 }
    );
  }
}
