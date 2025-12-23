"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteWorkflow(workflowId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  const workflow = await prisma.workflow.delete({
    where: { userId, id: workflowId },
  });
  if (!workflow) throw new Error("No Workflow found");
  revalidatePath("/workflows");
}
