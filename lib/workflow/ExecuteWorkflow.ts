/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { ExecutionStatus } from "@/types/workflows";
import { ExecutionPhase } from "../generated/prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executer/executerRegistry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  // Setup execution environment
  const edges = JSON.parse(execution.definition).edges as Edge[];
  const environment = { phases: {} };
  const creditsConsumed = 0;
  let executionFailed = false;

  // TODO: initialize workflow execution
  await initializeWorkflowExecution(executionId, execution.workflow.id);
  // TODO: initialize phase status
  await initializePhaseStatuses(execution);

  for (const phase of execution.phases) {
    // TODO: execute phase
    const phaseExecution = await executeWorkflowPhase(
      phase,
      environment,
      edges
    );
    if (!phaseExecution.success) {
      executionFailed = true;
    }
  }

  // TODO: Finalize execution
  await finalizeWorkflowExecution(
    executionId,
    execution.workflow.id,
    executionFailed,
    creditsConsumed
  );
  // TODO: cleanup execution environment
  await cleanupEnvironment(environment);
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

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },

      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((err) => {
      console.log(err);
    });
}

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[]
): Promise<{ success: boolean }> {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  if (!node) return { success: false };
  setupEnvironmentForPhase(node, environment, edges);
  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });
  const creditsConsumed = TaskRegistry[node?.data?.type]?.credits;
  console.log(
    `EXECUTING NODE ${node?.data?.type} : With Cost of ${creditsConsumed}`
  );

  // Execute Phase
  const outputs = environment.phases[node.id].outputs;
  const success = await executePhase(phase, node, environment);
  await finalizeWorkflowPhase(phase.id, success, outputs);
  return { success };
}

async function finalizeWorkflowPhase(
  phaseId: string,
  success: boolean,
  outputs: any
) {
  const finalStatus = success
    ? ExecutionStatus.COMPLETED
    : ExecutionStatus.FAILED;
  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) return false;
  const executionEnvironment = createExecutionEnvironment(node, environment);
  return await runFn(executionEnvironment);
}

function setupEnvironmentForPhase(
  node: AppNode,
  environment: Environment,
  edges: Edge[]
) {
  environment.phases[node.id] = {
    inputs: {},
    outputs: {},
  };
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
    const inputVal = node.data.inputs[input.name];
    // If the node value is passed manually
    if (!!inputVal) {
      environment.phases[node.id].inputs[input.name] = inputVal;
      continue;
    }
    // If the node value is passed by another node output
    const connectedEdge: Edge | undefined = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );
    if (!connectedEdge) {
      console.error("MISSING EDGE FOR INPUT", input.name, node.id);
      continue;
    }
    const outputVal =
      environment.phases[connectedEdge.source].outputs[
        connectedEdge.sourceHandle!
      ];
    environment.phases[node.id].inputs[input.name] = outputVal;
  }
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment
): ExecutionEnvironment<any> {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) =>
      (environment.phases[node.id].outputs[name] = value),
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),
    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page),
  };
}

async function cleanupEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser.close().catch((err) => {
      console.error("Couldn't close the browser : ", err);
    });
  }
}
