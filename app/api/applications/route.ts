import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/applications
// Returns all applications in the database as JSON
export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { dateApplied: "desc" },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}