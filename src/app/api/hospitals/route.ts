import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/hospitals:
 *   get:
 *     summary: Get all hospitals
 *     description: Retrieves a list of all available hospitals
 *     tags: [Hospitals]
 *     responses:
 *       200:
 *         description: List of hospitals successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hospital'
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    const hospitals = await prisma.hospital.findMany();
    return NextResponse.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hospitals' },
      { status: 500 }
    );
  }
}
