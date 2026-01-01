"use server";
import { PeriodToDateRange } from "@/lib/helper/dates";
import { prisma } from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { ExecutionStatus } from "@/types/workflows";
import { auth } from "@clerk/nextjs/server";

export async function GetStatsCardsValues(period: Period) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  const { startDate, endDate } = PeriodToDateRange(period);

  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        in: [ExecutionStatus.COMPLETED, ExecutionStatus.FAILED],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
        select: { creditsConsumed: true },
      },
    },
  });

  const stats = {
    workflowExecutions: executions.length,
    creditsConsumed: 0,
    phasesExecutions: 0,
  };

  stats.creditsConsumed = executions.reduce(
    (sum, execution) => sum + execution.creditsConsumed,
    0
  );
  stats.phasesExecutions = executions.reduce(
    (sum, execution) => sum + execution.phases.length,
    0
  );

  return stats;
}
