import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";

export function CalculateWorkflowCost(nodes: AppNode[]) {
  return nodes.reduce((acc, cur) => {
    const task = TaskRegistry[cur.data.type];
    return acc + (task.credits || 0);
  }, 0);
}
