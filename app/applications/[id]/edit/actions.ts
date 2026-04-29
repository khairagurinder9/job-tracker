"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateApplication(id: string, formData: FormData) {
  // Extract form values
  const company = formData.get("company") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;
  const link = formData.get("link") as string;
  const notes = formData.get("notes") as string;

  // Validate
  if (!company || !role) {
    throw new Error("Company and Role are required");
  }

  // Update the database
  await prisma.application.update({
    where: { id },
    data: {
      company,
      role,
      status: status as "APPLIED" | "INTERVIEWING" | "OFFER" | "REJECTED" | "WITHDRAWN",
      link: link || null,
      notes: notes || null,
    },
  });

  // Refresh cache
  revalidatePath("/");

  // Redirect to homepage
  redirect("/");
}