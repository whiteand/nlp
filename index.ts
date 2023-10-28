import assert from "node:assert";
import * as R from "ramda";
import { readJson } from "./lib";
import { createLogger } from "./createLogger";
import { chooseSimilar } from "./chooseSimilar";

const logger = createLogger();

const command = Bun.argv.at(2);

const COMMANDS = ["help", "language-stats"] as const;
type TCommand = (typeof COMMANDS)[number];

if (command === "help") {
  const helpCommand = Bun.argv.at(3);
  printHelp(helpCommand);
} else if (command === "language-stats") {
  const filePath = Bun.argv.at(3);
  assert(filePath, "Missing file path");
  const fileContent = await readJson<
    Record<string, { message: string; time: string }>
  >(filePath);
  const messages = Object.entries(fileContent).map(
    ([id, { message, time }]) => ({
      id,
      message,
      time,
    })
  );
  console.log(messages);
} else {
  printHelp(command);
  process.exit(1);
}

function printHelp(helpCommand: string | undefined) {
  if (helpCommand == null) {
    logger.log("Usage bun run <command> [options]");
    logger.log("Commands:");
    logger.withLevel(2, () => {
      logger.log("help - Show instruction");
      logger.log("help <command> - Show help for a command");
      logger.log(
        "language-stats <filePath> - Shows different stats related to language."
      );
      logger.withLevel(2, () => {
        logger.log('Read more using "help language-stats" command.');
      });
    });
    return;
  }
  if (helpCommand === "help") {
    logger.log("Usage: help - shows full instruction");
    logger.log("Example:\n  help");
    logger.log();
    logger.log("Usage: help <command>");
    logger.log("Example:\n  help language-stats");
    return;
  }
  if (helpCommand === "language-stats") {
    logger.log("Usage: language-stats <filePath>");
    logger.log('Example:\n  language-stats "data.json"');
    return;
  }

  const mostSimilar = chooseSimilar(helpCommand, COMMANDS);
  logger.log("Unknown command:", helpCommand);
  logger.log("Did you mean: " + mostSimilar + "?");
}
