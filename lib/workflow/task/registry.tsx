import { TaskType } from "@/types/task";
import { ExtractTextFromElement } from "./ExtractTextFromElement";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmlTask } from "./PageToHTML";
import { WorkflowTask } from "@/types/workflows";
import { FillInputTask } from "./FillInput";
import { ClickElementTask } from "./ClickElement";
import { WaitForElementTask } from "./WaitForElement";
import { DeliverViaWebhook } from "./DeliverViaWebHook";
import { ExtractDataWithAITask } from "./ExtractDataWithAI";
import { ReadPropertyFromJSONTask } from "./ReadPropertyFromJSON";
import { AddPropertyToJSONTask } from "./AddPropertyToJSON";
import { NavigateToURLTask } from "./NavigateToURL";
import { SendTelegramMessageTask } from "./sendTelegramMessage";
import { ScrollToElementTask } from "./ScrollToElement";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};
export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElement,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhook,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJSONTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJSONTask,
  NAVIGATE_URL: NavigateToURLTask,
  SEND_TELEGRAM_MESSAGE: SendTelegramMessageTask,
  SCROLL_TO_ELEMENT: ScrollToElementTask,
};
