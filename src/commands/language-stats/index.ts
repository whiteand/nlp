import assert from "assert";
import { renderContentToPlainText } from "../../telegram/renderContentToPlainText";
import { assertValidMessages } from "./assertValidMessages";
import { CharIter } from "../../CharIter";
import { Lexer } from "../../Lexer";

export async function languageStats(filePath: string): Promise<void> {
  const file = Bun.file(filePath, { type: "application/json" });
  assert(await file.exists(), "file is not exists");

  const messages = await file.json();
  assertValidMessages(messages);

  for (const m of messages) {
    const text = renderContentToPlainText(m.content);
    // console.log("Parsing:\n", colors.green(text));
    const charIter = new CharIter(text);
    const lexer = new Lexer(charIter);
    while (true) {
      const lexemEntry = lexer.next();
      if (lexemEntry.done) {
        break;
      }
    }
  }
  console.log("Done");
}
