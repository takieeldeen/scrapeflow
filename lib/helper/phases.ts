import { ExecutionPhase } from "../generated/prisma/client";

type Phase = Pick<ExecutionPhase, "creditsConsumed">;
export function GetPhasesTotalConst(phases: Phase[]) {
  return phases.reduce((acc, cur) => acc + (cur.creditsConsumed || 0), 0);
}
