import { TContent } from "./telegram";

export function isValidContentItem(item: any): item is TContent {
  if (
    (item.type === "text" || item.type === "strong" || item.type === "em") &&
    typeof item.text === "string"
  ) {
    return true;
  }
  if (
    (item.type === "anchor" || item.type === "mention") &&
    typeof item.text === "string" &&
    typeof item.href === "string"
  ) {
    return true;
  }
  if (item.type === "emoji" && typeof item.emoji === "string") {
    return true;
  }
  if (
    item.type === "hashtag" &&
    typeof item.hashtag === "string" &&
    item.hashtag.startsWith("#")
  ) {
    return true;
  }
  return false;
}
