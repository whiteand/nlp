import { parseShortenedBigNumber } from "./parseShortenedBigNumber";

export function parseReaction({ r }: { r: { id: string; count: string } }): {
  id: string;
  count: number;
} {
  return {
    id: r.id,
    count: parseShortenedBigNumber(r.count),
  };
}
