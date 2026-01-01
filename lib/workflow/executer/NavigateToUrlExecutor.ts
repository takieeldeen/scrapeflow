/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from "@/types/executor";
import { NavigateToURLTask } from "../task/NavigateToURL";
export async function NavigateToUrlExecutor(
  environment: ExecutionEnvironment<typeof NavigateToURLTask>
): Promise<boolean> {
  try {
    const url = environment.getInput("URL");
    if (!url) environment.log.error("input-> Url not defined");
    await environment.getPage()?.goto(url);
    environment.log.info(`Navigated to page successfully`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
