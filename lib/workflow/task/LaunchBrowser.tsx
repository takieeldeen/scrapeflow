import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflows";
import { GlobeIcon, LucideProps } from "lucide-react";

// This is the most resource intensive process
export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: "Launch Browser",
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: true,
  inputs: [
    {
      name: "Website Url",
      type: TaskParamType.STRING,
      helperText: "eg: https://www.google.com",
      required: true,
      hideHandle: true,
    },
  ] as const,
  outputs: [
    {
      name: "Website page",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
  credits: 5,
} satisfies WorkflowTask;
