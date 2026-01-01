/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJSONTask } from "../task/ReadPropertyFromJSON";
export async function ReadPropertyFromJSONExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJSONTask>
): Promise<boolean> {
  try {
    const jsonData = environment.getInput("JSON");
    if (!jsonData) environment.log.error("input-> JSON not defined");
    const propertyName = environment.getInput("Property Name");
    if (!propertyName)
      environment.log.error("input-> Property Name not defined");
    const json = JSON.parse(jsonData);
    const propVal = json[propertyName];
    if (!propVal) environment.log.error("input-> Property Value not defined");

    environment.setOutput("Property Value", propVal);

    environment.log.info(`Propert Value Extracted successfully`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
