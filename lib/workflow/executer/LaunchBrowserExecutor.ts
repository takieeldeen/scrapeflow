/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website Url");
    const browser = await puppeteer.launch({
      headless: true, // For testing
    });
    environment.log.info("Browser started successfully");
    environment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.log.info(`Browser opened url: ${websiteUrl}`);
    environment.setPage(page);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
