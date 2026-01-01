/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAITask } from "../task/ExtractDataWithAI";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { symmetricDecrypt } from "@/lib/encryption";
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials");
    if (!credentials) environment.log.error("input-> credentials not defined");

    const prompt = environment.getInput("Prompt");
    if (!prompt) environment.log.error("input-> prompt not defined");

    const content = environment.getInput("Content");
    if (!content) environment.log.error("input-> content not defined");

    const { userId } = await auth();
    if (!userId) {
      environment.log.error("input-> Unauthenticated");
      return false;
    }

    // Get Credentials Fro database
    const credential = await prisma.credentials.findUnique({
      where: {
        id: credentials,
        userId,
      },
    });

    if (!credential) {
      environment.log.error("input-> Credentials Not Found");
      return false;
    }

    const decrypted = symmetricDecrypt(credential.value);
    if (!decrypted) {
      environment.log.error("input-> Can't decrypt credential");
      return false;
    }

    const endpoint = "https://models.github.ai/inference";
    const model = "openai/gpt-4o-mini";
    const client = ModelClient(endpoint, new AzureKeyCredential(decrypted));
    // const mockExtractedData = {
    //   usernameSelector: "#username",
    //   passwordSelector: "#password",
    //   loginSelector: "body > div > form > input.btn.btn-primary",
    // };

    // const openai = new OpenAI({
    //   apiKey: decrypted,
    // });

    const response: any = await client.path("/chat/completions").post({
      body: {
        messages: [
          {
            role: "system",
            content:
              "You are a webscraper helper that extracts data from HTML or text. You Will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If not data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text",
          },
          {
            role: "user",
            content,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: model,
      },
    });

    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You are a webscraper helper that extracts data from HTML or text. You Will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If not data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text",
    //     },
    //     {
    //       role: "user",
    //       content,
    //     },
    //     {
    //       role: "user",
    //       content: prompt,
    //     },
    //   ],
    //   temperature: 1,
    // });

    // environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
    // environment.log.info(
    //   `Completition tokens: ${response.usage?.completion_tokens}`
    // );

    environment.log.info(JSON.stringify(response.body));
    const result = response.body.choices[0].message.content;
    if (!result) {
      environment.log.error("Empty response from AI");
      return false;
    }

    environment.setOutput("Extracted data", result);
    // environment.setOutput("Extracted data", JSON.stringify(mockExtractedData));
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
