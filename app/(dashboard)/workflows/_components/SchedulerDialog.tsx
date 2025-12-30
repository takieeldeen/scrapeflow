/* eslint-disable react-hooks/set-state-in-effect */
import { UpdateWorkflowCron } from "@/actions/workflows/updateWorkflowCron";
import CustomDialogHeader from "@/components/customDialogHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import cronstrue from "cronstrue";
import { CronExpressionParser } from "cron-parser";
import { RemoveWorkflowSchedule } from "@/actions/workflows/removeWorkflowSchedule";
import { Separator } from "@/components/ui/separator";

function SchedulerDialog({
  workflowId,
  workflowCron,
}: {
  workflowId: string;
  workflowCron: string | null;
}) {
  const [cron, setCron] = useState<string>(workflowCron || "");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState("");
  const { mutate, isPending } = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Schedule Updated Successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "cron" });
    },
  });
  const { mutate: mutateRemoveSchedule, isPending: isRemovingSchedule } =
    useMutation({
      mutationFn: RemoveWorkflowSchedule,
      onSuccess: () => {
        toast.success("Schedule removed Successfully", { id: "cron" });
      },
      onError: () => {
        toast.error("Something went wrong", { id: "cron" });
      },
    });
  useEffect(() => {
    try {
      CronExpressionParser.parse(cron);
      const humanCronString = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(humanCronString);
    } catch {
      setValidCron(false);
    }
  }, [cron]);
  const workflowHasValidCron = workflowCron && workflowCron.length > 0;
  const readableSavedCron =
    workflowHasValidCron && cronstrue.toString(workflowCron!);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"sm"}
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            workflowHasValidCron && "text-primary"
          )}
        >
          {workflowHasValidCron && (
            <div className="flex items-center gap-2">
              <ClockIcon />

              {readableSavedCron}
            </div>
          )}
          {!workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="h-3 w-3" />
              Set Schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Schedule Workflow Execution"
          icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          <p>
            Specify a cron expression to schedule periodic workflow execution.
            All times are in UTC
          </p>
          <Input
            placeholder="E.g. * * * * *"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          <div
            className={cn(
              "bg-accent rounded-md p-4 border text-sm border-destructive text-destructive",
              validCron && "border-primary text-primary"
            )}
          >
            {validCron ? readableCron : "Not a valid crone expression"}
          </div>
          {workflowHasValidCron && (
            <DialogClose asChild>
              <div className="">
                <Button
                  className="w-full text-destructive border-destructive hover:text-destructive"
                  variant={"outline"}
                  disabled={isPending || isRemovingSchedule}
                  onClick={() => {
                    toast.loading("Removing Schedule...", { id: "cron" });
                    mutateRemoveSchedule(workflowId);
                  }}
                >
                  Remove Current Schedule
                </Button>
                <Separator className="my-4" />
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className="px-6 gap-2 flex">
          <DialogClose asChild>
            <Button className="flex-1" variant={"secondary"}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                toast.loading("Updating Schedule...", { id: "cron" });
                mutate({ workflowId, cron });
              }}
              disabled={isPending || !validCron}
              className="flex-1"
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SchedulerDialog;
