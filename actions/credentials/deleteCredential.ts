"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteCredentials(credentialId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  const workflow = await prisma.credentials.delete({
    where: { userId, id: credentialId },
  });
  if (!workflow) throw new Error("No Workflow found");
  revalidatePath("/credentials");
}
