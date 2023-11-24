import { App } from "./App/App";
import { IMPROVE_TELEGRAM_MESSAGE_COMMAND } from "./commands/improve-telegram-messages";
import { LANGUAGE_STATS_COMMAND } from "./commands/language-stats/LanguageStats";
import { PARSE_COMMAND } from "./commands/parse";
import { SERVE_COMMAND } from "./commands/serve";
import { TELEGRAM_PRINT_COMMAND } from "./commands/telegram-print/TelegramPrint";
import { createLogger } from "./createLogger";

const logger = createLogger();

await new App({
  logger,
})
  .registerCommand(LANGUAGE_STATS_COMMAND)
  .registerCommand(TELEGRAM_PRINT_COMMAND)
  .registerCommand(IMPROVE_TELEGRAM_MESSAGE_COMMAND)
  .registerCommand(PARSE_COMMAND)
  .registerCommand(SERVE_COMMAND)
  .run(Bun.argv);
