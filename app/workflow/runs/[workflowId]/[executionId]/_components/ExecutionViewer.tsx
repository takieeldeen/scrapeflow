/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DatesToDurationString } from "@/lib/helper/dates";
import { GetPhasesTotalConst } from "@/lib/helper/phases";
import { ExecutionStatus } from "@/types/workflows";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";
import { ReactNode, useState } from "react";

// type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;
type ExecutionData = any;
function ExecutionViewer({
  initialData,
  fetchExecutionDetails,
  fetchPhaseDetails,
}: {
  initialData: ExecutionData;
  fetchExecutionDetails: any;
  fetchPhaseDetails: any;
}) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => fetchExecutionDetails(initialData!.id),
    refetchInterval: (q) =>
      q.state.data?.status === ExecutionStatus.RUNNING ? 1000 : false,
  });

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: !!selectedPhase,
    queryFn: () => fetchPhaseDetails(selectedPhase!),
  });
  const isRunning = query?.data?.status === ExecutionStatus.RUNNING;

  const duration = DatesToDurationString(
    query?.data?.completedAt,
    query?.data?.startedAt
  );
  const creditsConsumed = GetPhasesTotalConst(query?.data?.phases || []);
  return (
    <div className="flex w-full h-full">
      <aside className="w-110 min-w-110 max-w-110 border-r-2 border-separate flex grow flex-col overflow-hidden">
        <div className="py-4 px-2">
          <ExecutionLabel
            icon={CircleDashedIcon}
            label="Status"
            value={query?.data?.status}
          />
          <ExecutionLabel
            icon={CalendarIcon}
            label="Started At"
            value={
              <span className="lowercase">
                {query?.data?.startedAt
                  ? formatDistanceToNow(new Date(query.data.startedAt), {
                      addSuffix: true,
                    })
                  : "--"}
              </span>
            }
          />
          <ExecutionLabel
            icon={ClockIcon}
            label="Duration"
            value={
              duration ? (
                duration
              ) : (
                <Loader2Icon size={20} className="animate-spin" />
              )
            }
          />
          <ExecutionLabel
            icon={CoinsIcon}
            label="Credits Consumed"
            value={creditsConsumed}
          />
          <Separator />
          <div className="flex justify-center items-center py-2 px-4">
            <div className="text-muted-foreground flex items-center gap-2">
              <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
              <span className="font-semibold">Phases</span>
            </div>
          </div>
          <Separator />
          <div className="oveflow-auto h-full px-2 py-4">
            {query.data?.phases?.map((phase: any, index: number) => (
              <Button
                onClick={() => {
                  if (isRunning) return;
                  setSelectedPhase(phase.id);
                }}
                key={index}
                className="w-full justify-between my-1"
                variant={selectedPhase === phase.id ? "default" : "ghost"}
              >
                <div className="flex items-center gap-2">
                  <Badge variant={"outline"}>{index + 1}</Badge>
                  <p className="font-semibold">{phase.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">{phase.status}</p>
              </Button>
            ))}
          </div>
        </div>
      </aside>
      <div className="flex w-full h-full">
        <pre>{JSON.stringify(phaseDetails?.data || {}, null, 4)}</pre>
      </div>
    </div>
  );
}

function ExecutionLabel({
  icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon size={20} className="stroke-muted-foreground/80" />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize flex gap-2 items-center">
        {value}
      </div>
    </div>
  );
}

export default ExecutionViewer;
