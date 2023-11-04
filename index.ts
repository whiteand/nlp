import assert from "node:assert";
import { createLogger } from "./createLogger";
import { languageStats } from "./languageStats";
import { printHelp } from "./printHelp";

const logger = createLogger();

const command = Bun.argv.at(2);

if (command === "help") {
  printHelp(logger, Bun.argv.slice(3));
} else if (command === "language-stats") {
  const filePath = Bun.argv.at(3);
  assert(filePath, "Missing file path");

  await languageStats(filePath);
} else {
  printHelp(logger, []);
  process.exit(1);
}
