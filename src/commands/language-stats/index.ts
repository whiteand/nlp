import { Lexem, LexemsList } from "../../lexer/Lexem";
import { getLexemsFromContent } from "./getLexemsFromContent";
import { readBetterMessagesFromFile } from "../../telegram/readBetterMessagesFromFile";

export async function languageStats(filePath: string): Promise<void> {
  const messages = await readBetterMessagesFromFile(filePath);

  const lexems = LexemsList.empty();

  for (const m of messages) {
    for (const lexem of getLexemsFromContent(m.content)) {
      lexems.push(lexem);
    }
  }

  console.log(
    lexems
      // .selectByType("ukrainian-word")
      // .filter((entry) => entry.item.text.length > 4 && entry.count > 1)
      .sliceTop(0, 25)
      .toString()
  );
  console.log("Done");
}
