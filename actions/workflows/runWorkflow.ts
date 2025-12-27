"use server";

import { prisma } from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  ExecutionPhaseTrigger,
  ExecutionStatus,
} from "@/types/workflows";
import { auth } from "@clerk/nextjs/server";
<<<<<<< HEAD
=======
import { redirect } from "next/navigation";
>>>>>>> 158dafbbf439335d3816bfbf6060297473f9dc66

export async function RunWorkflow({
  workflowId,
  flowDefinition,
}: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthenticated");
<<<<<<< HEAD
=======
  console.log({ userId, id: workflowId });
>>>>>>> 158dafbbf439335d3816bfbf6060297473f9dc66
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
  const execution = await prisma.workflowExecution.create({
    data: {
      userId,
      workflowId,
      status: ExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: ExecutionPhaseTrigger.MANUAL,
      phases: {
        create: executionPlan.flatMap((phase) =>
          phase.nodes.flatMap((node) => ({
            userId,
            status: ExecutionPhaseStatus.CREATED,
            number: phase.phase,
            node: JSON.stringify(node),
            name: TaskRegistry[node.data.type].label,
          }))
        ),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });
  if (!execution) throw new Error("Workflow Execution Not Created");
<<<<<<< HEAD
  return {
    executionId: execution.id,
  };
  // redirect(`/workflow/runs/${workflowId}/${execution.id}`);
=======
  redirect(`/workflows/${workflowId}/${execution.id}`);
>>>>>>> 158dafbbf439335d3816bfbf6060297473f9dc66
}
