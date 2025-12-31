/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/ExecuteWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  ExecutionPhaseTrigger,
  ExecutionStatus,
  WorkflowExecutionPlan,
} from "@/types/workflows";
import { timingSafeEqual } from "crypto";
import { CronExpressionParser } from "cron-parser";

function isValidSecret(secret: string) {
  const API_SECERT = process.env.API_SECRET;
  if (!API_SECERT) return false;

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECERT));
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  console.log("EXECUTION_FUNCTION_WAS_CALLED");
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = authHeader.split(" ")[1];

  if (!isValidSecret(secret)) {
    console.log(authHeader);
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get("workflowId") as string;

  if (!workflowId) {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if (!workflow) {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  const executionPlan = JSON.parse(
    workflow.executionPlan!
  ) as WorkflowExecutionPlan;
  if (!executionPlan) {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  try {
    const cron = CronExpressionParser.parse(workflow.cron!);
    const nextRun = cron.next().toDate();
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        definition: workflow.definition,
        status: ExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: ExecutionPhaseTrigger.CRON,
        phases: {
          create: executionPlan.flatMap((phase) =>
            phase.nodes.flatMap((node) => ({
              userId: workflow.userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            }))
          ),
        },
      },
    });
    await ExecuteWorkflow(execution.id, nextRun);
    return new Response(null, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
