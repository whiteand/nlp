import { Temporal } from "@js-temporal/polyfill";
import { TContent } from "./telegram";
import { ReactionType } from "./reactions";

export interface IBetterTelegramPost {
  time: Temporal.ZonedDateTime;
  edited: Temporal.ZonedDateTime | null;
  original: Temporal.ZonedDateTime | null;
  id: string;
  views: number;
  content: TContent[];
  reactions: { id: string; count: number; type: ReactionType }[];
}
