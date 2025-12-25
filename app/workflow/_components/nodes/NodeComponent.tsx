import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/types/appNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import NodeInputs from "./NodeInputs";
import NodeInput from "./NodeInput";
import NodeOutputs from "./NodeOutputs";
import NodeOutput from "./NodeOutput";

const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props?.data as AppNodeData;
  const task = TaskRegistry[nodeData.type];

  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected}>
      <NodeHeader taskType={nodeData.type} nodeId={props.id} />
      <NodeInputs>
        {task?.inputs?.map((input) => (
          <NodeInput input={input} nodeId={props.id} key={input?.name} />
        ))}
      </NodeInputs>
      <NodeOutputs>
        {task?.outputs?.map((output) => (
          <NodeOutput output={output} nodeId={props.id} key={output?.name} />
        ))}
      </NodeOutputs>
    </NodeCard>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
