/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import React from "react";
import NodeParamField from "./NodeParamField";
import { ColorForHandle } from "./common";
import useFlowValidation from "@/components/hooks/useFlowValidation";
import { FieldError } from "@/components/ui/field";

function NodeInput({ input, nodeId }: { input: TaskParam; nodeId: string }) {
  const edges = useEdges();
  const connected = edges.some(
    (edg) => edg.target === nodeId && edg.targetHandle === input.name
  );
  const { invalidInputs } = useFlowValidation();
  const currentInputInvalid = invalidInputs
    .find((n) => n.nodeId === nodeId)
    ?.inputs?.find((i: any) => i.name === input.name);
  return (
    <div
      className={cn(
        "flex justify-start relative p-3 bg-secondary w-full",
        currentInputInvalid && "bg-destructive/30"
      )}
    >
      <NodeParamField param={input} nodeId={nodeId} connected={connected} />
      {!input.hideHandle && (
        <Handle
          isConnectable={!connected}
          id={input.name}
          type="target"
          position={Position.Left}
          className={cn(
            "bg-muted-foreground! border-2! border-background! left-0! w-4! h-4!",
            ColorForHandle[input.type]
          )}
        />
      )}
    </div>
  );
}

export default NodeInput;
