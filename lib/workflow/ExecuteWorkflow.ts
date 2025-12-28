/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { ExecutionStatus } from "@/types/workflows";
import { WorkflowExecution } from "../generated/prisma/client";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  // Setuo execution environment
  const environment = { phases: {} };

  // TODO: initialize workflow execution
  await initializeWorkflowExecution(executionId, execution.workflow.id);
  // TODO: initialize phase status
  await initializePhaseStatuses(execution);
  const executionFailed = false;

  for (const phase of execution.phases) {
    // TODO: execute phase
  }

  // TODO: Finalize execution
  await finalizeWorkflowExecution(
    executionId,
    execution.workflow.id,
    executionFailed,
    creditsConsumed
  );
  // TODO: cleanup execution environment
  revalidatePath("/workflows/runs");
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: ExecutionStatus.RUNNING,
    },
  });

  await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: ExecutionStatus.RUNNING,
      lastRunId: executionId,
    },
  });
}

async function initializePhaseStatuses(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: { in: execution.phases.map((phase: any) => phase.id) },
    },
    data: {
      status: ExecutionStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? ExecutionStatus.FAILED
    : ExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
      
    },

    data: {
      status: finalStatus,
      lastRunStatus: finalStatus,
    },
  });
}
