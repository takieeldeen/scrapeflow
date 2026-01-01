/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionEnvironment } from "@/types/executor";
import { SendTelegramMessageTask } from "../task/sendTelegramMessage";
import { symmetricDecrypt } from "@/lib/encryption";
import TelegramBot from "node-telegram-bot-api";
import { prisma } from "@/lib/prisma";

export async function SendTelegramMessageExecutor(
  environment: ExecutionEnvironment<typeof SendTelegramMessageTask>
): Promise<boolean> {
  try {
    const message = environment.getInput("Message");
    if (!message) environment.log.error("input-> Message not defined");
    const botToken = environment.getInput("Bot Token");
    if (!botToken) environment.log.error("input-> BotToken Not defined");

    const token = await prisma.credentials.findUnique({
      where: {
        id: botToken,
      },
    });
    if (!token) {
      environment.log.error("Couldn't find the token value");
      return false;
    }

    const decrypted = symmetricDecrypt(token.value);
    if (!decrypted) {
      environment.log.error("input-> Can't decrypt credential");
      return false;
    }
    const bot = new TelegramBot(decrypted);
    await bot.sendMessage("8241601618", message);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
