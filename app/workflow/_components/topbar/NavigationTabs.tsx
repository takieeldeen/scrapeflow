import { Tabs, TabsList } from "@/components/ui/tabs";
import Link from "next/link";
import React from "react";

function NavigationTabs({ workflowId }: { workflowId: string }) {
  return (
    <Tabs className="w-100">
      <TabsList className="grid w-full grid-cols-2">
        <Link href={`/workflow/editor/${workflowId}`}>Editor</Link>
        <Link href={`/workflow/runs/${workflowId}`}>Runs</Link>
      </TabsList>
    </Tabs>
  );
}

export default NavigationTabs;
