import { readableStreamToText } from "bun";
import { ICommand } from "../../App/types";
import { TextBuilder } from "../../TextBuilder";
import { CharIter } from "../../CharIter";
import { Lexer } from "../../lexer/Lexer";
import { AdvancedLexer } from "./AdvancedLexer";
import { loadUkrainianDictionary } from "./ukrainianDictionary";
import { LexerStats } from "./LexerStats";

export const PARSE_COMMAND: ICommand = {
  help() {
    return {
      message: new TextBuilder({ width: 80 })
        .write("<stdin> | parse")
        .space()
        .gray("-")
        .space()
        .pushCurrentAsTab()
        .gray(
          "parses stdandard input as a list of lexems, outputs them as a list of JSON objects"
        )
        .popTab()
        .build(),
    };
  },
  name: "parse",
  async run() {
    const text = await readableStreamToText(Bun.stdin.stream());
    const charIter = new CharIter(text);
    const lexer = new Lexer(charIter);
    const stats = new LexerStats();
    const advancedLexer = new AdvancedLexer(lexer, {
      dictionaries: [await loadUkrainianDictionary()],
      stats,
    });
    const lexems = advancedLexer.collect([]);
  },
  shortHelpInGlobalHelp(b) {
    b.write("parse")
      .gray(" - ")
      .pushCurrentAsTab()
      .gray("parses all lexems from the standard input and outputs it as JSON")
      .popTab();
  },
};
