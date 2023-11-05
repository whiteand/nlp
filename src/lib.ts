import assert from "node:assert";

export async function readJson<T>(filePath: string): Promise<T> {
  const file = Bun.file(filePath, { type: "application/json" });
  assert(await file.exists());
  const fileContent = await file.json();
  return fileContent;
}
