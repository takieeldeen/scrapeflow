import { cn } from "@/lib/utils";
import { ExecutionStatus } from "@/types/workflows";
import React from "react";

const indicatorColors: Record<ExecutionStatus, string> = {
  PENDING: "bg-slate-400",
  RUNNING: "bg-yellow-400",
  FAILED: "bg-red-400",
  COMPLETED: "bg-emerald-600",
};

function ExecutionStatusIndicator({ status }: { status: ExecutionStatus }) {
  return (
    <div className={cn("w-2 h-2 rounded-full", indicatorColors[status])} />
  );
}

export default ExecutionStatusIndicator;
