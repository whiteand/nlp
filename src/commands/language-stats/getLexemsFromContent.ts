import { renderContentToPlainText } from "../../telegram/renderContentToPlainText";
import { CharIter } from "../../CharIter";
import { Lexer } from "../../lexer/Lexer";
import { Lexem } from "../../lexer/Lexem";
import { TContent } from "../../telegram/telegram";

export function* getLexemsFromContent(
  content: TContent[]
): Generator<Lexem, void, unknown> {
  for (const item of content) {
    if (item.type === "hashtag") {
      yield {
        type: "hashtag",
        text: item.hashtag,
      };
      continue;
    }
    if (item.type === "mention") {
      yield {
        type: "mention",
        text: item.text,
      };
      continue;
    }
    const text = renderContentToPlainText([item]);
    const charIter = new CharIter(text);
    const lexer = new Lexer(charIter);
    while (true) {
      const lexemEntry = lexer.next();
      if (lexemEntry.done) {
        break;
      }
      yield lexemEntry.value;
    }
  }
}
