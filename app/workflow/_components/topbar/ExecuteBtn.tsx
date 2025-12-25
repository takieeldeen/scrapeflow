import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import React, { useCallback } from "react";

function ExecuteBtn({ workflowId }: { workflowId: string }) {
  const executeWorkflow = useCallback(() => {
    console.log(workflowId);
  }, [workflowId]);
  return (
    <Button
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
