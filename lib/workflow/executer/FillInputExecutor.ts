/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/FillInput";
export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("CSS Selector");
    if (!selector) environment.log.error("input-> Selector not defined");
    const value = environment.getInput("Value");
    if (!value) environment.log.error("input-> Value not defined");

    await environment.getPage()?.type(selector, value);
    environment.log.info(`Input filled successfully`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
