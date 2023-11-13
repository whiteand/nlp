import { App } from "./App/App";
import { LANGUAGE_STATS_COMMAND } from "./commands/language-stats";
import { TELEGRAM_PRINT_COMMAND } from "./commands/telegram-print";
import { createLogger } from "./createLogger";

const logger = createLogger();

await new App({
  logger,
})
  .registerCommand(LANGUAGE_STATS_COMMAND)
  .registerCommand(TELEGRAM_PRINT_COMMAND)
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
