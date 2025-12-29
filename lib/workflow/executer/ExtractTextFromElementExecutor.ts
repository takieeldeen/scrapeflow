/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cheerio from "cheerio";
import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElement } from "../task/ExtractTextFromElement";
export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElement>
): Promise<boolean> {
  try {
    const selector = environment.getInput("CSS Selector");
    if (!selector) {
      environment.log.error("Selector is not provided");
      return false;
    }
    const html = environment.getInput("Html");
    if (!html) {
      environment.log.error("HTML is not provided");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);
    if (!element) {
      environment.log.error("Element is not found");
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText) {
      environment.log.error("Text is not found");
      return false;
    }

    environment.setOutput("Extracted Text", extractedText);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
