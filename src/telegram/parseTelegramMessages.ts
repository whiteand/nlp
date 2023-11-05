import { Temporal } from "@js-temporal/polyfill";
import { readJson } from "../lib";
import { parseTelegramTime } from "./parseTelegramTime";
import { IMessage } from "./telegram";
import { IBetterTelegramPost } from "./IBetterTelegramPost";
import { parseShortenedBigNumber } from "./parseShortenedBigNumber";
import { parseReaction } from "./parseReaction";

export async function parseTelegramMessages(filePath: string): Promise<void> {
  const fileContent = await readJson<Record<string, IMessage>>(filePath);

  const messages = Object.values(fileContent);
  const betterMessages: IBetterTelegramPost[] = [];
  for (const { time, id, views, content, reactions, ...m } of messages) {
    const messageTime = parseTelegramTime(time);
    const viewsNumber = parseShortenedBigNumber(views);
    const betterMessage: IBetterTelegramPost = {
      time: messageTime.time,
      edited: messageTime.edited,
      original: messageTime.original,
      id,
      views: viewsNumber,
      content,
      reactions: reactions.map((r) => parseReaction({ r })),
    };
    betterMessages.push(betterMessage);
  }
  betterMessages.sort((a, b) => {
    const aTime = a.time;
    const bTime = b.time;
    return Temporal.ZonedDateTime.compare(aTime, bTime);
  });
  const newPath = filePath.replace(/\.json$/, "-v2.json");
  await Bun.write(newPath, JSON.stringify(betterMessages, null, 2));
  console.log("done");
}
