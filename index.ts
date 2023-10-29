import assert from "node:assert";
import { createLogger } from "./createLogger";
import { readJson } from "./lib";
import { printHelp } from "./printHelp";
import { languageStats } from "./languageStats";

const logger = createLogger();

const command = Bun.argv.at(2);

if (command === "help") {
  printHelp(logger, Bun.argv.slice(3));
  process.exit(0);
}

if (command === "language-stats") {
  const filePath = Bun.argv.at(3);
  assert(filePath, "Missing file path");

  const fileContent = await readJson<
    Record<string, { message: string; time: string }>
  >(filePath);

  languageStats(fileContent);

  process.exit(0);
}

printHelp(logger, []);
process.exit(1);
