/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ExecutionPhase,
  ExecutionPhaseLog,
} from "@/lib/generated/prisma/client";
import { DatesToDurationString } from "@/lib/helper/dates";
import { GetPhasesTotalConst } from "@/lib/helper/phases";
import { cn } from "@/lib/utils";
import { LogLevel } from "@/types/log";
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
import { ReactNode, useEffect, useState } from "react";
import PhaseStatusBadge from "./phaseStatusBadge";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";

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
  useEffect(() => {
    const phases: ExecutionPhase[] = query?.data?.phases || [];
    if (isRunning) {
      const sortedPhases = phases.toSorted((a, b) =>
        a.startedAt! > b.startedAt! ? -1 : 1
      );
      const phaseToSelect = sortedPhases[0];
      if (phaseToSelect) setSelectedPhase(phaseToSelect.id);
    } else {
      const sortedPhases = phases.toSorted((a, b) =>
        a.completedAt! > b.completedAt! ? -1 : 1
      );
      const phaseToSelect = sortedPhases[0];
      setSelectedPhase(phaseToSelect.id);
    }
  }, [isRunning, query?.data?.phases]);
  const creditsConsumed = GetPhasesTotalConst(query?.data?.phases || []);
  return (
    <div className="flex w-full h-full">
      <aside className="w-110 min-w-110 max-w-110 border-r-2 border-separate flex grow flex-col overflow-hidden">
        <div className="py-4 px-2">
          <ExecutionLabel
            icon={CircleDashedIcon}
            label="Status"
            value={
              <div className="font-semibold capitalize flex gap-2 items-center">
                <PhaseStatusBadge status={query.data.status} />
                <span>{query?.data?.status}</span>
              </div>
            }
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
            value={<ReactCountUpWrapper value={creditsConsumed} />}
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
                className={cn(
                  "w-full justify-between my-1",
                  selectedPhase === phase.id && "bg-muted text-foreground"
                )}
                variant={selectedPhase === phase.id ? "default" : "ghost"}
              >
                <div className="flex items-center gap-2">
                  <Badge variant={"outline"}>{index + 1}</Badge>
                  <p className="font-semibold">{phase.name}</p>
                </div>
                <PhaseStatusBadge status={phase.status as ExecutionStatus} />
              </Button>
            ))}
          </div>
        </div>
      </aside>
      <div className="flex w-full h-full px-4">
        {isRunning && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <p className="font-bold">Run is in progress, please wait</p>
          </div>
        )}
        {!isRunning && !selectedPhase && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <div className="flex flex-col gap-1 text-center">
              <p className="font-bold">No Phase Selected</p>
              <p className="text-sm text-muted-foreground">
                Select a phase to view details
              </p>
            </div>
          </div>
        )}
        {!isRunning && selectedPhase && phaseDetails.data && (
          <div className="flex flex-col py-4 container gap-4 overflow-auto">
            <div className="flex gap-2 items-center">
              <Badge variant={"outline"} className="space-x-4">
                <div className="flex gap-1 items-center">
                  <CoinsIcon size={18} className="stroke-muted-foreground" />
                  <span>Credits</span>
                </div>
                <span>{phaseDetails.data.creditsConsumed}</span>
              </Badge>
              <Badge variant={"outline"} className="space-x-4">
                <div className="flex gap-1 items-center">
                  <ClockIcon size={18} className="stroke-muted-foreground" />
                  <span>Duration</span>
                </div>
                <span>
                  {DatesToDurationString(
                    phaseDetails.data.completedAt,
                    phaseDetails.data.startedAt
                  ) || "--"}
                </span>
              </Badge>
            </div>
            {/* Inputs */}
            <ParameterViewer
              title="Inputs"
              subtitle="Inputs used for this phase"
              paramJSON={phaseDetails.data.inputs}
            />
            <ParameterViewer
              title="Outputs"
              subtitle="Outputs generated by this phase"
              paramJSON={phaseDetails.data.outputs}
            />
            <LogViewer logs={phaseDetails.data.logs} />
          </div>
        )}
        {/* <pre>{JSON.stringify(phaseDetails?.data || {}, null, 4)}</pre> */}
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

function ParameterViewer({
  title,
  subtitle,
  paramJSON,
}: {
  title: string;
  subtitle: string;
  paramJSON: string | null;
}) {
  const params = paramJSON ? JSON.parse(paramJSON) : undefined;
  return (
    <Card className="py-0">
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex flex-col gap-2">
          {(!params || Object.keys(params).length === 0) && (
            <p className="text-sm">No Parameters generated by this phase</p>
          )}
          {params &&
            Object.entries(params).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center space-y-1"
              >
                <p className="text-sm text-muted-foreground flex-1 basis-1/3">
                  {key}
                </p>
                <Input
                  readOnly
                  className="flex-1 basis-2/3"
                  value={value as string}
                />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LogViewer({ logs }: { logs: ExecutionPhaseLog[] | undefined }) {
  if (!logs || logs.length === 0) return null;
  return (
    <Card className="py-0">
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">Logs</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Logs generated by this phase
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 px-4">
        <Table className="">
          <TableHeader className="text-muted-foreground text-sm">
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="text-muted-foreground">
                <TableCell
                  width={190}
                  className="text-xs text-muted-foreground p-0.5 pl-4"
                >
                  {log.timestamp.toISOString()}
                </TableCell>
                <TableCell
                  width={80}
                  className={cn(
                    "uppercase text-xs font-bold p-0.75 pl-4",
                    (log.logLevel as LogLevel) === "error" &&
                      "text-destructive",
                    (log.logLevel as LogLevel) === "info" && "text-primary"
                  )}
                >
                  {log.logLevel}
                </TableCell>
                <TableCell className="text-sm flex-1 p-0.75 pl-4">
                  {log.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ExecutionViewer;
