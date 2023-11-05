export function letterToMultiplier(letter: string | undefined): number {
  if (letter == null) {
    return 1;
  }
  if (letter === "K") {
    return 1000;
  }
  if (letter === "M") {
    return 1000000;
  }
  throw new Error("unknown letter: " + letter);
}
