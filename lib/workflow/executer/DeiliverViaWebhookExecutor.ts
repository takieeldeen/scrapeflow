/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebhook } from "../task/DeliverViaWebHook";
export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhook>
): Promise<boolean> {
  try {
    const body = environment.getInput("Body");
    if (!body) environment.log.error("Body is not defined");

    const targetUrl = environment.getInput("Target URL");
    if (!targetUrl) environment.log.error("Target URL is not defined");

    // Wait till the DOM is Loaded
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const statusCode = response.status;
    if (statusCode !== 200) {
      environment.log.error(`Status Code: ${statusCode}`);
      return false;
    }
    const responseBody = await response.json();

    environment.log.info(JSON.stringify(responseBody, null, 4));
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
