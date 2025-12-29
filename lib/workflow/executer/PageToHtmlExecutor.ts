/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHTML";
import { waitFor } from "@/lib/helper/wait-for";
export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content();
    environment.setOutput("Html", html);
    await waitFor(3000);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
