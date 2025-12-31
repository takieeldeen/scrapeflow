/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";
export async function ClickElementExecutor(
  environment: ExecutionEnvironment<typeof ClickElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("CSS Selector");
    if (!selector) environment.log.error("input-> Selector not defined");
    await environment.getPage()?.click(selector);
    environment.log.info(`Element Clicked successfully`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
