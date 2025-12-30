/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CronExpressionParser } from "cron-parser";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflowCron({
  workflowId,
  cron,
}: {
  workflowId: string;
  cron: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthenticated");
  try {
    const interval = CronExpressionParser.parse(cron);
    await prisma.workflow.update({
      where: { id: workflowId, userId },
      data: {
        cron,

        nextRunAt: interval.next().toDate(),
      },
    });
    revalidatePath(`/workflows`);
  } catch (error: any) {
    console.error("Invalid Cron:", error.message);
    throw new Error("Invalid Cron Expression");
  }
}
