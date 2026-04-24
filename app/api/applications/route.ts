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

// POST /api/applications
// Creates a new application from the request body
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation — required fields
    if (!body.userId || !body.company || !body.role) {
      return NextResponse.json(
        { error: "Missing required fields: userId, company, role" },
        { status: 400 }
      );
    }

    const newApplication = await prisma.application.create({
      data: {
        userId: body.userId,
        company: body.company,
        role: body.role,
        link: body.link || null,
        status: body.status || "APPLIED",
        notes: body.notes || null,
      },
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}