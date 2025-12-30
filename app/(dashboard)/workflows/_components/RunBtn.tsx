import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

function RunBtn({ workflowId }: { workflowId: string }) {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: ({ executionId }) => {
      toast.success("Workflow Started", { id: workflowId });
      router.push(`/workflow/runs/${workflowId}/${executionId}`);
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId });
    },
  });
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="flex items-center gap-2 cursor-pointer"
      disabled={isPending}
      onClick={() => {
        mutate({ workflowId });
        toast.loading("Scheduling Run...", { id: workflowId });
      }}
    >
      <PlayIcon size={16} />
      Run
    </Button>
  );
}

export default RunBtn;
