/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppNode, AppNodeMissingInputs } from "@/types/appNode";
import {
  WorkflowExecutionPhase,
  WorkflowExecutionPlan,
} from "@/types/workflows";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

export enum FlowToExecutionPlanValidationError {
  "NO_ENTRY_POINT",
  "INVALID_INPUTS",
}
type FlowToExecutionPlan = {
  executionPlan?: WorkflowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanValidationError;
    invalidElements: AppNodeMissingInputs[];
  };
};

export function FlowToExecutionPlan(nodes: AppNode[], edges: Edge[]) {
  const entryPoint = nodes?.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );
  if (!entryPoint)
    return {
      error: {
        type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT,
      },
    };
  const inputsWithErrors: AppNodeMissingInputs[] = [];
  const planned = new Set<string>();

  const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
  if (invalidInputs.length > 0)
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs as any[],
    });
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];
  planned.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
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
          inputsWithErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs as any[],
          });
        } else {
          // let's skip this node for now and check it later
          continue;
        }
      }

      nextPhase.nodes.push(currentNode);
    }
    for (const plannedNode of nextPhase.nodes) {
      planned.add(plannedNode.id);
    }
    executionPlan.push(nextPhase);
  }
  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
        invalidElements: inputsWithErrors,
      },
    };
  }
  return { executionPlan };
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs = [];
  // Get all the inputs that shall enter these task from task definition
  const inputs = TaskRegistry[node.data.type].inputs;
  // Check for every input in the current node inputs
  for (const input of inputs) {
    // If the input is not required no need for checking
    if (!input.required) continue;
    // First Check: Check if there is a value provided by the user
    const inputValue = node.data.inputs[input.name];
    const inputProvidedByUser = (inputValue?.length ?? 0) > 0;
    if (inputProvidedByUser) continue;
    // Get all the edges pointing towards the current node
    const incomingEdges = edges.filter((edge) => edge.target === node.id);
    // Get the node input that has the same name as the current input
    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );
    // Second Check: Check if there is a value provided by the connection
    const inputProvidedByOutput =
      !!inputLinkedToOutput && planned.has(inputLinkedToOutput.source);
    if (inputProvidedByOutput) continue;
    invalidInputs.push(input);
  }

  return invalidInputs;
}

function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]) {
  if (!node.id) return [];
  const incomersIds = new Set();
  edges.forEach((e) => {
    if (e.target === node.id) incomersIds.add(e.source);
  });
  return nodes.filter((n) => incomersIds.has(n.id));
}
