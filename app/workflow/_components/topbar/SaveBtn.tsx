import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function SaveBtn({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();
  const { mutate, isPending } = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () =>
      toast.success("Workflow Saved Succesfully", { id: "save-workflow" }),
    onError: () =>
      toast.error("Error While Updating Workflow", { id: "save-workflow" }),
  });
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        toast.loading("Saving Workflow", { id: "save-workflow" });
        mutate({ id: workflowId, definition: workflowDefinition });
      }}
      disabled={isPending}
    >
      {!isPending && (
        <>
          <CheckIcon className="stroke-green-400" size={16} />
          Save
        </>
      )}
      {isPending && <Spinner />}
    </Button>
  );
}

export default SaveBtn;
