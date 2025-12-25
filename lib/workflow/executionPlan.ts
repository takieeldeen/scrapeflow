import { AppNode } from "@/types/appNode";
import {
  WorkflowExecutionPhase,
  WorkflowExecutionPlan,
} from "@/types/workflows";
import { Edge, getIncomers, Node } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

type FlowToExecutionPlan = {
  executionPlan?: WorkflowExecutionPlan;
};

export function FlowToExecutionPlan(nodes: AppNode[], edges: Edge[]) {
  const entryPoint = nodes?.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );
  if (!entryPoint) throw new Error("TODO : HANDLE THIS ERROR");
  const planned = new Set<string>();
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  for (
    let phase = 2;
    phase <= nodes.length || planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPhase = {
      phase,
      nodes: [],
    };
    for (const currentNode of nodes) {
      // Node already put in the execution plan
      const alreadyPlanned = planned.has(currentNode.id);
      if (alreadyPlanned) continue;
      // Node has Invalid inputs
      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          // If all Incomers are already planned this means that this step is invalid
          console.log("INVALID_INPUTS", currentNode.id, invalidInputs);
          throw new Error("TODO: HANDLE ERROR 1");
        } else {
          // let's skip this node for now and check it later
          continue;
        }
      }

      nextPhase.nodes.push(currentNode);
      planned.add(currentNode.id);
    }
  }
  return { executionPlan };
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs = [];
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    if (!input.required) continue;
    const inputValue = node.data.inputs[input.name];
    const inputProvidedByUser = inputValue.length > 0;
    if (inputProvidedByUser) continue;
    const incomingEdges = edges.filter((edge) => edge.target === node.id);
    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );
    const inputProvidedByOutput =
      !!inputLinkedToOutput && planned.has(inputLinkedToOutput.source);
    if (inputProvidedByOutput) continue;
    invalidInputs.push(input);
  }
}
