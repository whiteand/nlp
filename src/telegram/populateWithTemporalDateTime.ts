import { Temporal } from "@js-temporal/polyfill";
import { IBetterTelegramPost } from "./IBetterTelegramPost";

export function populateWithTemporalDateTime(
  messages: IBetterTelegramPost[]
): void {
  for (const message of messages) {
    message.time = Temporal.ZonedDateTime.from(message.time);
    message.edited =
      message.edited && Temporal.ZonedDateTime.from(message.edited);
    message.original =
      message.original && Temporal.ZonedDateTime.from(message.original);
  }
}
