import assert from "assert";
import { IBetterTelegramPost } from "../../telegram/IBetterTelegramPost";
import { Temporal } from "@js-temporal/polyfill";
import { REACTION_TYPES } from "../../telegram/reactions";
import { isValidContentItem } from "../../telegram/isValidContentItem";

function isTemporalString(value: any): value is string {
  try {
    Temporal.ZonedDateTime.from(value);
    return true;
  } catch (err) {
    return false;
  }
}

function assertValidMessage(
  message: any,
  index: number
): asserts message is IBetterTelegramPost {
  if (!message) {
    throw new Error("invalid mesasge at: " + index + ": is null ");
  }
  assert(
    isTemporalString(message.time),
    `invalid time at: ${index}:  not a temporal string: ${message.time}`
  );
  if (message.edited) {
    assert(
      isTemporalString(message.edited),
      `invalid "edited" at: ${index}: not a temporal string: ${message.edited}`
    );
  }
  if (message.original) {
    assert(
      isTemporalString(message.original),
      `invalid "original" at: ${index}: not a temporal string: ${message.original}`
    );
  }
  assert(
    typeof message.id === "string",
    `invalid mesage at ${index}: id is not a string: ${message.id}`
  );
  assert(
    Number.isSafeInteger(message.views),
    `invalid "views" at ${index}: ${message.views}`
  );
  assert(
    Array.isArray(message.reactions),
    `reactions are absent in message at ${index}`
  );
  for (let j = 0; j < message.reactions.length; j++) {
    const reaction = message.reactions[j];
    assert(
      typeof reaction.id === "string",
      `invalid reaction at ${j} in message at ${index}: id is not a string`
    );
    assert(
      typeof reaction.count === "number",
      `invalid reaction at ${j} in message at ${index}: count is not a number`
    );
    assert(
      REACTION_TYPES.some((t) => reaction.type === t),
      `invalid reaction type: ${reaction.type} at ${j} at message at ${index}`
    );
  }
  assert(
    Array.isArray(message.content),
    `invalid "content" at ${index}: not an array`
  );
  for (let j = 0; j < message.content.length; j++) {
    const item = message.content[j];
    if (!isValidContentItem(item)) {
      throw new Error(
        'invalid "content" at ' +
          j +
          " at message at " +
          index +
          ": " +
          "invalid item: " +
          JSON.stringify(item)
      );
    }
  }
}

function assertValidMessages(
  messages: any
): asserts messages is IBetterTelegramPost[] {
  if (!Array.isArray(messages)) {
    throw new Error("invalid messages: not an array");
  }
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    assertValidMessage(message, i);
  }
}

export async function languageStats(filePath: string): Promise<void> {
  const file = Bun.file(filePath, { type: "application/json" });
  assert(await file.exists(), "file is not exists");
  const messages = await file.json();
  assertValidMessages(messages);
  console.log("valid messages");
}
