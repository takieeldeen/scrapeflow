import { prisma } from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflows";

export async function GET(req: Request) {
  const now = new Date();
  const workflows = await prisma.workflow.findMany({
    select: { id: true },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: { lte: now },
    },
  });
  console.log("@@WORKFLOW TO RUN", workflows.length);
  for (const workflow of workflows) {
    triggerWorkflow(workflow.id);
  }

  return new Response(null, { status: 200 });
}
