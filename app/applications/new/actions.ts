"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function createApplication(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be logged in to create an application");
  }

  const company = formData.get("company") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;
  const link = formData.get("link") as string;
  const notes = formData.get("notes") as string;

  if (!company || !role) {
    throw new Error("Company and Role are required");
  }

  await prisma.application.create({
    data: {
      userId,
      company,
      role,
      status: status as "APPLIED" | "INTERVIEWING" | "OFFER" | "REJECTED" | "WITHDRAWN",
      link: link || null,
      notes: notes || null,
    },
  });

  revalidatePath("/");
  redirect("/");
}