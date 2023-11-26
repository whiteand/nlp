export function parseOrDefault(take: unknown, defaultValue: number): number {
  if (typeof take === "number") {
    return take;
  }
  if (typeof take === "string") {
    const value = Number.parseInt(take, 10);
    if (Number.isNaN(value)) {
      return defaultValue;
    }
    return value;
  }
  return defaultValue;
}
