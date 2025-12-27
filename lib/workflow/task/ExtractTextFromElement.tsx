import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflows";
import { CaseSensitive, LucideProps } from "lucide-react";

export const ExtractTextFromElement = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract Text From Element",
  icon: (props: LucideProps) => (
    <CaseSensitive className="stroke-rose-800" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "CSS Selector",
      type: TaskParamType.STRING,
      required: true,
      hideHandle: true,
      helperText: "CSS selector of the element to extract text from",
    },
  ],
  outputs: [
    {
      name: "Extracted Text",
      type: TaskParamType.STRING,
    },
  ],
  credits: 2,
} satisfies WorkflowTask;
