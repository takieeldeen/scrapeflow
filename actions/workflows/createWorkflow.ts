"use server";

import { prisma } from "@/lib/prisma";
import { CreateFLowNode } from "@/lib/workflow/createFlowNode";
import {
  CreateWorkflowSchemaType,
  createWorkflowSchmea,
} from "@/schema/workflows";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflows";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";

export async function CreateWorkflow(form: CreateWorkflowSchemaType) {
  const { success, data } = createWorkflowSchmea.safeParse(form);
  if (!success) throw new Error("Invaid Form Data");
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };
  initialFlow.nodes.push(CreateFLowNode(TaskType.LAUNCH_BROWSER));
  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data,
    },
  });
  if (!result) throw new Error("failed to create workflow");
  redirect(`/workflow/editor/${result.id}`);
}
