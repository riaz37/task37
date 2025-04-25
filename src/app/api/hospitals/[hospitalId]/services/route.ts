import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/hospitals/{hospitalId}/services:
 *   get:
 *     summary: Get services for a specific hospital
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: hospitalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Internal server error
 */
export async function GET(
  request: Request,
  { params }: { params: { hospitalId: string } }
) {
  try {
    const services = await prisma.service.findMany({
      where: {
        hospitalId: params.hospitalId
      }
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
