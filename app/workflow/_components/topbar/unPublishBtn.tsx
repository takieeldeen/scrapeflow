"use client";
import UnpublishWorkflow from "@/actions/workflows/unpublishWorkflow";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import React, { useCallback } from "react";
import { toast } from "sonner";

function UnPublishBtn({ workflowId }: { workflowId: string }) {
  const { mutate, isPending } = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () =>
      toast.success("Workflow Unpublished Succesfully", {
        id: "unpublish-workflow",
      }),
    onError: () =>
      toast.error("Error While unpublishing Workflow", {
        id: "unpublish-workflow",
      }),
  });

  const unpublishWorkflow = useCallback(() => {
    toast.loading("Unpublishing Workflow...", { id: "unpublish-workflow" });
    mutate({ id: workflowId });
  }, [mutate, workflowId]);

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={unpublishWorkflow}
      disabled={isPending}
    >
      {!isPending && (
        <>
          <DownloadIcon className="stroke-orange-700" size={16} />
          Unpublish
        </>
      )}
      {isPending && <Spinner />}
    </Button>
  );
}

export default UnPublishBtn;
