import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import { useExecutionPlan } from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import React, { useCallback } from "react";
import { toast } from "sonner";

function ExecuteBtn({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();
  const { mutate, isPending } = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Execution Started", { id: "flow-execution" });
    },
    onError: () => {
      toast.error("Execution Failed", { id: "flow-execution" });
    },
  });
  const { generateExecutionPlan } = useExecutionPlan();
  const executeWorkflow = useCallback(() => {
    const executionPlan = generateExecutionPlan();
    if (!executionPlan) return;
    mutate({ workflowId, flowDefinition: JSON.stringify(toObject()) });
  }, [generateExecutionPlan, mutate, toObject, workflowId]);
  return (
    <Button
      disabled={isPending}
      variant={"outline"}
      onClick={executeWorkflow}
      className="flex items-center gap-2"
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      Execute
    </Button>
  );
}

export default ExecuteBtn;
