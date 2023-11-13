import { App } from "./App/App";
import { IMPROVE_TELEGRAM_MESSAGE_COMMAND } from "./commands/improve-telegram-messages";
import { LANGUAGE_STATS_COMMAND } from "./commands/language-stats/LanguageStats";
import { TELEGRAM_PRINT_COMMAND } from "./commands/telegram-print/TelegramPrint";
import { createLogger } from "./createLogger";

const logger = createLogger();

await new App({
  logger,
})
  .registerCommand(LANGUAGE_STATS_COMMAND)
  .registerCommand(TELEGRAM_PRINT_COMMAND)
  .registerCommand(IMPROVE_TELEGRAM_MESSAGE_COMMAND)
  .run(Bun.argv);

// if (command === "help") {
//   printHelp(logger, Bun.argv.slice(3));
// } else if (command === "language-stats") {
//   await languageStats();
// } else if (command === "improve-telegram-messages") {
//   const filePath = Bun.argv.at(3);
//   assert(filePath, "Missing file path");
//   await parseTelegramMessages(filePath);
// } else if (command === "telegram-print") {
//   const filePath = Bun.argv.at(3);
//   assert(filePath, "Missing file path");
//   await telegramPrint(filePath);
// } else {
//   printHelp(logger, []);
//   process.exit(1);
// }
