/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cheerio from "cheerio";
import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElement } from "../task/ExtractTextFromElement";
export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElement>
): Promise<boolean> {
  try {
    const selector = environment.getInput("CSS Selector");
    if (!selector) return false;
    const html = environment.getInput("Html");
    if (!html) return false;
    const $ = cheerio.load(html);
    const element = $(selector);
    if (!element) {
      console.error("Element Not Found");
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText) {
      console.log("No text to extract");
      return false;
    }

    environment.setOutput("Extracted Text", extractedText);
    // environment.setOutput('Extracted Text', html);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
