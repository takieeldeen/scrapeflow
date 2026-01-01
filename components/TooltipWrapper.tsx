import React, { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function TooltipWrapper({
  children,
  content,
  side,
}: {
  children: ReactNode;
  content?: string | null;
  side?: "top" | "bottom" | "left" | "right";
}) {
  if (!content) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </Tooltip>
  );
}

export default TooltipWrapper;
