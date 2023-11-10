import assert from "assert";
import { populateWithTemporalDateTime } from "./populateWithTemporalDateTime";
import { assertValidMessages } from "./assertValidMessages";
import { IBetterTelegramPost } from "./IBetterTelegramPost";

export async function readBetterMessagesFromFile(
  filePath: string
): Promise<IBetterTelegramPost[]> {
  const file = Bun.file(filePath, { type: "application/json" });
  assert(await file.exists(), "file is not exists");

  const messages = await file.json();
  assertValidMessages(messages);
  populateWithTemporalDateTime(messages);
  return messages;
}
