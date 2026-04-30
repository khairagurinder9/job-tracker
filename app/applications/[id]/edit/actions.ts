"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function updateApplication(id: string, formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be logged in");
  }

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    throw new Error("Application not found or access denied");
  }

  const company = formData.get("company") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;
  const link = formData.get("link") as string;
  const notes = formData.get("notes") as string;

  if (!company || !role) {
    throw new Error("Company and Role are required");
  }

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

  revalidatePath("/");
  redirect("/");
}

export async function deleteApplication(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be logged in");
  }

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    throw new Error("Application not found or access denied");
  }

  await prisma.application.delete({
    where: { id },
  });

  revalidatePath("/");
  redirect("/");
}