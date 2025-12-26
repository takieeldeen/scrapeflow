"use server";

import { prisma } from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { WorkflowExecutionPlan } from "@/types/workflows";
import { auth } from "@clerk/nextjs/server";

export async function RunWorkflow({
  workflowId,
  flowDefinition,
}: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthenticated");
  console.log({ userId, id: workflowId });
  const workflow = await prisma.workflow.findUnique({
    where: { userId, id: workflowId },
  });
  if (!workflow) throw new Error("Workflow Not Found");
  if (!flowDefinition) throw new Error("Flow Definition is not defined");

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) throw new Error("Flow Definition is not valid");
  if (!result.executionPlan)
    throw new Error("Failed to generate execution plan");
  const executionPlan = result.executionPlan;
  console.log(executionPlan, "@EXECUTION_PLAN_FROM_SERVER");
}
