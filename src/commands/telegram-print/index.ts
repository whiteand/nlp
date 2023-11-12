import { readBetterMessagesFromFile } from "../../telegram/readBetterMessagesFromFile";
import { renderContentToPlainText } from "../../telegram/renderContentToPlainText";

export async function telegramPrint(filePath: string): Promise<void> {
  const messages = await readBetterMessagesFromFile(filePath);

  for (const m of messages) {
    const text = renderContentToPlainText(m.content);
    process.stdout.write(text + "\n\n");
  }
}
