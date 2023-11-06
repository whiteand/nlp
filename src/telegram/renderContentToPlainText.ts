import { TContent } from "./telegram";

export function renderContentToPlainText(content: TContent[]): string {
  const res = [];
  for (const c of content) {
    if (c.type === "text" || c.type === "strong" || c.type === "em") {
      res.push(c.text);
      continue;
    }
    if (c.type === "anchor" || c.type === "mention") {
      res.push(c.text);
      continue;
    }
    if (c.type === "emoji") {
      res.push(c.emoji);
      continue;
    }
    if (c.type === "hashtag") {
      res.push(c.hashtag);
      continue;
    }
    throw new Error("not implemented yet: " + JSON.stringify(c));
  }
  return res.join("");
}
