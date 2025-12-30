import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateFLowNode } from "@/lib/workflow/createFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import { useReactFlow } from "@xyflow/react";
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import React, { useCallback } from "react";

function NodeHeader({
  taskType,
  nodeId,
}: {
  taskType: TaskType;
  nodeId: string;
}) {
  const { deleteElements, getNode, setNodes } = useReactFlow();
  const task = TaskRegistry[taskType];

  const deleteNode = useCallback(async () => {
    await deleteElements({ nodes: [{ id: nodeId }] });
  }, [deleteElements, nodeId]);

  const duplicateNode = useCallback(() => {
    const node = getNode(nodeId);
    const newX = (node?.position.x ?? 0) + 30;
    const newY = (node?.position.y ?? 0) + 30;
    const newPosition = { x: newX, y: newY };
    const newNode = CreateFLowNode(node?.data?.type as TaskType, newPosition);
    setNodes((n) => n.concat(newNode));
  }, [getNode, nodeId, setNodes]);
  return (
    <div className={cn("flex items-center gap-2 p-2")}>
      <task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-1 items-center">
          {task.isEntryPoint && <Badge>Entry Point</Badge>}
          <Badge className="gap-2 flex items-center text-xs">
            <CoinsIcon size={16} />
            {task.credits}
          </Badge>
          {!task.isEntryPoint && (
            <>
              <Button variant={"ghost"} size={"icon"} onClick={deleteNode}>
                <TrashIcon size={12} />
              </Button>
              <Button variant={"ghost"} size={"icon"} onClick={duplicateNode}>
                <CopyIcon size={12} />
              </Button>
            </>
          )}
          <Button
            variant={"ghost"}
            size={"icon"}
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NodeHeader;
