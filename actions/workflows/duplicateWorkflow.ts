"use server";

import { prisma } from "@/lib/prisma";
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType,
} from "@/schema/workflows";
import { WorkflowStatus } from "@/types/workflows";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function duplicateWorkflow(form: duplicateWorkflowSchemaType) {
  const { userId } = await auth();
  const { success, data } = duplicateWorkflowSchema.safeParse(form);

  if (!success) throw new Error("Invalid form data");
  if (!userId) throw new Error("Unauthenticated");

  const sourceWorkflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: data.workflowId,
    },
  });

  if (!sourceWorkflow) throw new Error("Workflow not found");

  const result = await prisma.workflow.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      status: WorkflowStatus.DRAFT,
      definition: sourceWorkflow.definition,
    },
  });

  if (!result) throw new Error("Failed to duplicate workflow");

  revalidatePath("/workflows");
}
