/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from "@/types/executor";
import { WaitForElementTask } from "../task/WaitForElement";
export async function WaitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("CSS Selector");
    if (!selector) environment.log.error("input-> Selector not defined");
    const visibility = environment.getInput("Visibility");
    if (!visibility) environment.log.error("input-> Visibility Not defined");

    // Wait till the DOM is Loaded
    await environment.getPage()?.waitForNavigation({
      waitUntil: "domcontentloaded",
    });

    await environment.getPage()?.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
    });
    environment.log.info(
      `Element with selector ${selector} found successfully`
    );
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
