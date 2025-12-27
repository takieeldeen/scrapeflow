"use client";
import { Workflow } from "@/lib/generated/prisma/client";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { DragEventHandler, useCallback, useEffect } from "react";
import "@xyflow/react/dist/style.css";
import { CreateFLowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import NodeComponent from "./nodes/NodeComponent";
import DeletableEdge from "./edges/DeletableEdge";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode } from "@/types/appNode";

const nodeTypes = {
  Node: NodeComponent,
};

const edgeTypes = {
  default: DeletableEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 };
function FlowEditor({ workflow }: { workflow: Workflow }) {
  const { setViewport, screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([
    CreateFLowNode(TaskType.LAUNCH_BROWSER),
  ]);
  const { updateNodeData } = useReactFlow();
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  }, []);
  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      const taskType = event.dataTransfer.getData("application/reactflow");
      if (typeof taskType === undefined || !taskType) return;
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = CreateFLowNode(taskType as TaskType, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (!connection.targetHandle) return;

      const node = nodes.find((n) => n.id === connection.target);
      if (!node) return;
      const nodeInputs = node.data?.inputs;
      delete nodeInputs?.[connection.targetHandle];
      updateNodeData(connection.target, {
        inputs: nodeInputs,
      });
    },
    [nodes, setEdges, updateNodeData]
  );
  const checkConnectionValidation = useCallback(
    (connection: Connection | Edge) => {
      // No Self Connection Allowed
      if (connection.source === connection.target) return false;
      // No Connection before different types
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (!sourceNode || !targetNode) return false;
      const sourceTask = TaskRegistry[sourceNode.data.type];
      const targetTask = TaskRegistry[targetNode.data.type];
      const output = sourceTask?.outputs?.find(
        (o) => o.name === connection.sourceHandle
      );
      const input = targetTask?.inputs?.find(
        (o) => o.name === connection.targetHandle
      );
      if (!output || !input) return false;
      if (output.type !== input.type) return false;

      // Prevent Cycles in the graph
      const hasCycle = (node: AppNode, visited = new Set<string>()) => {
        if (visited.has(node.id)) return false;
        visited.add(node.id);
        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };
      const detectedCycle = hasCycle(targetNode);

      return !detectedCycle;
    },
    [edges, nodes]
  );
  useEffect(() => {
    const flow = JSON.parse(workflow.definition);
    if (!flow) return;
    setNodes(flow.nodes ?? []);
    setEdges(flow.edges ?? []);
    if (!flow.viewport) return;
    const { x = 0, y = 0, zoom = 1 } = flow.viewport;
    setViewport({ x, y, zoom });
  }, [setEdges, setNodes, setViewport, workflow.definition]);
  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitView
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={checkConnectionValidation}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;
