import assert from "node:assert";
import { createLogger } from "./createLogger";
import { parseTelegramMessages } from "./telegram/parseTelegramMessages";
import { printHelp } from "./printHelp";
import { languageStats } from "./commands/language-stats";
import { telegramPrint } from "./commands/telegram-print";

const logger = createLogger();

const command = Bun.argv.at(2);

if (command === "help") {
  printHelp(logger, Bun.argv.slice(3));
} else if (command === "language-stats") {
  await languageStats();
} else if (command === "improve-telegram-messages") {
  const filePath = Bun.argv.at(3);
  assert(filePath, "Missing file path");
  await parseTelegramMessages(filePath);
} else if (command === "telegram-print") {
  const filePath = Bun.argv.at(3);
  assert(filePath, "Missing file path");
  await telegramPrint(filePath);
} else {
  printHelp(logger, []);
  process.exit(1);
}
