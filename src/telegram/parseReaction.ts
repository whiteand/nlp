import { parseShortenedBigNumber } from "./parseShortenedBigNumber";
import { ReactionType, parseReactionType } from "./reactions";

export function parseReaction({ r }: { r: { id: string; count: string } }): {
  id: string;
  count: number;
  type: ReactionType;
} {
  const type = parseReactionType(r.id);
  return {
    id: r.id,
    type,
    count: parseShortenedBigNumber(r.count),
  };
}
