/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from "@/types/executor";
import { AddPropertyToJSONTask } from "../task/AddPropertyToJSON";
export async function AddPropertyToJSONExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyToJSONTask>
): Promise<boolean> {
  try {
    const jsonData = environment.getInput("JSON");
    if (!jsonData) environment.log.error("input-> JSON not defined");
    const propertyName = environment.getInput("Property Name");
    if (!propertyName)
      environment.log.error("input-> Property Name not defined");
    const propertyValue = environment.getInput("Property Value");
    if (!propertyValue)
      environment.log.error("input-> Property Value not defined");
    const json = JSON.parse(jsonData);
    json[propertyName] = propertyValue;
    environment.setOutput("Updated JSON", JSON.stringify(json));
    environment.log.info(`Propert Value Added successfully`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
