"use client";
import { PublishWorkflow } from "@/actions/workflows/publishWorkflow";
import { useExecutionPlan } from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { UploadIcon } from "lucide-react";
import React, { useCallback } from "react";
import { toast } from "sonner";

function PublishBtn({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();
  const { generateExecutionPlan } = useExecutionPlan();
  const { mutate, isPending } = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () =>
      toast.success("Workflow Published Succesfully", {
        id: "publish-workflow",
      }),
    onError: () =>
      toast.error("Error While Publishing Workflow", {
        id: "publish-workflow",
      }),
  });

  const publishWorkflow = useCallback(() => {
    const executionPlan = generateExecutionPlan();
    if (!executionPlan) return;
    mutate({ id: workflowId, flowDefinition: JSON.stringify(toObject()) });
  }, [generateExecutionPlan, mutate, toObject, workflowId]);

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={publishWorkflow}
      disabled={isPending}
    >
      {!isPending && (
        <>
          <UploadIcon className="stroke-indigo-700" size={16} />
          Publish
        </>
      )}
      {isPending && <Spinner />}
    </Button>
  );
}

export default PublishBtn;
