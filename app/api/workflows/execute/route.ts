import { WorkflowExecution } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ExecutionPhaseTrigger, ExecutionStatus } from "@/types/workflows";
import { timingSafeEqual } from "crypto";

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
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = authHeader.split(" ")[1];

  if (!isValidSecret(secret)) {
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
  ) as WorkflowExecution;
  if (!executionPlan) {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId: workflow.userId,
      definition: workflow.definition,
      status: ExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: ExecutionPhaseTrigger.CRON,
    },
  });
}
