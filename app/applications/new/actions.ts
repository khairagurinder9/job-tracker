"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createApplication(formData: FormData) {
  // Extract form values
  const company = formData.get("company") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;
  const link = formData.get("link") as string;
  const notes = formData.get("notes") as string;

  // Validate required fields
  if (!company || !role) {
    throw new Error("Company and Role are required");
  }

  // Save to database
  await prisma.application.create({
    data: {
      userId: "test_user_1", // hardcoded for now, until we add auth
      company,
      role,
      status: status as "APPLIED" | "INTERVIEWING" | "OFFER" | "REJECTED" | "WITHDRAWN",
      link: link || null,
      notes: notes || null,
    },
  });

  // Refresh the homepage cache so new application appears
  revalidatePath("/");

  // Redirect back to homepage
  redirect("/");
}