import { letterToMultiplier } from "./letterToMultiplier";

export function parseShortenedBigNumber(text: string): number {
  const match = /^((\d+)(\.(\d+))?)([KM])?$/.exec(text);
  if (!match) {
    throw new Error("cannot parse views: " + text);
  }
  const floatString = match[1];
  const letter = match[5];
  const float = Number.parseFloat(floatString);
  const multiplier = letterToMultiplier(letter);
  return Math.round(float * multiplier);
}
