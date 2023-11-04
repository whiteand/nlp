import { readJson } from "./lib";
import { IMessage } from "./telegram";

export async function languageStats(filePath: string): Promise<void> {
  const fileContent = await readJson<Record<string, IMessage>>(filePath);

  const messages = Object.values(fileContent);
  let res = 0;
  for (const m of messages) {
    console.log(m.time);
  }
}
