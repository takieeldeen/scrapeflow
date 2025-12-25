import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { Node, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

export const useExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const result = FlowToExecutionPlan(nodes as AppNode[], edges);
    const executionPlan: (Node | AppNode)[] = [];
    nodes.forEach((node, i) => {
      const taskType = node.data.type as TaskType;
      const taskDefinition = TaskRegistry[taskType];
      if (taskDefinition.isEntryPoint) executionPlan.push(node);
    });
    return executionPlan;
  }, [toObject]);
  return { generateExecutionPlan };
};
