/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from "@/types/executor";
import { ScrollToElementTask } from "../task/ScrollToElement";
export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("CSS Selector");
    if (!selector) environment.log.error("input-> Selector not defined");
    await environment.getPage()?.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) {
        throw new Error("Element not found");
      }
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top });
      }
    }, selector);
    environment.log.info(`Element Clicked successfully`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
