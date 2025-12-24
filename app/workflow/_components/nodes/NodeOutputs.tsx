import React, { ReactNode } from "react";

function NodeOutputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

export default NodeOutputs;
