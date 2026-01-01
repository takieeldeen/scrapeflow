import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflows";
import { FileJsonIcon, MessageCircleIcon } from "lucide-react";

export const SendTelegramMessageTask = {
  type: TaskType.SEND_TELEGRAM_MESSAGE,
  label: "Send Telegram Message",
  icon: (props) => <MessageCircleIcon className="stroke-blue-400" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Message",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Bot Token",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
  ] as const,
  outputs: [
    // {
    //   name: "Property Value",
    //   type: TaskParamType.STRING,
    // },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
