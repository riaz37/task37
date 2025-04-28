import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Params } from "@/types/params";

/**
 * @swagger
 * /api/hospitals/{hospitalId}/services:
 *   get:
 *     summary: Get services for a specific hospital
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hospitalId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the hospital
 *     responses:
 *       200:
 *         description: List of services successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       404:
 *         description: Hospital not found
 *       500:
 *         description: Server error
 */

export async function GET(_request: Request, { params }: { params: Params<{ hospitalId: string }> }) {
  const { hospitalId } = await params;

  try {
    const services = await prisma.service.findMany({
      where: {
        hospitalId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
