import { levenshtein } from "./levenshtein";

export function chooseSimilar<T extends string>(
  word: string,
  words: readonly T[]
): T {
  let minIndex = 0;
  let minDistance = levenshtein(word, words[0]);
  for (let i = 1; i < words.length; i++) {
    const distance = levenshtein(word, words[i]);
    if (distance < minDistance) {
      minDistance = distance;
      minIndex = i;
    }
  }
  return words[minIndex];
}
