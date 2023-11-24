import { TextBuilder } from "../../TextBuilder";
import { chooseSimilar } from "../../chooseSimilar";
import { IAdvancedLexerStats } from "./IAdvancedLexerStats";
import { guessDictionaryEntry } from "./guessDictionaryEntry";
import { FullLexem, IDictionary, IUkrainianFullLexem } from "./types";

type TAdvancedLexerResult<SourceLexem extends { type: string; text: string }> =
  | {
      type: "ok";
      lexems: FullLexem<SourceLexem>[];
    }
  | {
      type: "unknown-ukranian-word";
      lexem: SourceLexem;
      message: string;
    };

export class AdvancedLexer<SourceLexem extends { type: string; text: string }>
  implements Iterator<TAdvancedLexerResult<SourceLexem>>
{
  private lexer: Iterator<SourceLexem>;
  private dictionaries: IDictionary<SourceLexem>[];
  private stats: IAdvancedLexerStats;
  constructor(
    lexer: Iterator<SourceLexem>,
    options: {
      dictionaries: IDictionary<SourceLexem>[];
      stats: IAdvancedLexerStats;
    }
  ) {
    this.lexer = lexer;
    this.dictionaries = options.dictionaries;
    this.stats = options.stats;
  }

  next(): IteratorResult<TAdvancedLexerResult<SourceLexem>, any> {
    const lexerEntry = this.lexer.next();
    if (lexerEntry.done) {
      return { done: true, value: undefined };
    }

    const lexem = lexerEntry.value;
    this.stats.onLexem(lexem.text);
    if (lexem.type === "ukrainian-word") {
      const res = this.parseUkrainianWord(lexem);

      if (res.type === "ok") {
        this.stats.onUkrainianLexem();
      }

      return {
        value: res,
        done: lexerEntry.done,
      };
    }

    const restResult: TAdvancedLexerResult<SourceLexem> = {
      type: "ok",
      lexems: [
        {
          type: "rest",
          lexem,
        },
      ],
    };
    return {
      value: restResult,
      done: lexerEntry.done,
    };
  }
  parseUkrainianWord(lexem: SourceLexem): TAdvancedLexerResult<SourceLexem> {
    const possibleEntries: FullLexem<SourceLexem>[] = [];
    for (const dictionary of this.dictionaries) {
      const entry = dictionary.get(lexem.text);
      possibleEntries.push(...entry);
    }
    if (possibleEntries.length === 0) {
      const entries: IUkrainianFullLexem[] = [];
      for (const dictionary of this.dictionaries) {
        for (const entry of dictionary.values()) {
          if (entry.type !== "ukrainian-word") continue;
          entries.push(entry);
        }
      }
      const similarText = chooseSimilar(
        lexem.text,
        entries.map((e) => e.details.text)
      );
      const similarEntry = entries.find((e) => e.details.text === similarText)!;
      const errorMessage = new TextBuilder({
        width: 80,
      })
        .gray("There is no dictionary entry for word: ")
        .writeColored("red", lexem.text)
        .newline()
        .gray("Did you mean: ")
        .write(similarText)
        .write("?")
        .newline()
        .gray("If yes you can add this entry to the dictionary: ")
        .newline()
        .newline(2)
        .write(guessDictionaryEntry(similarEntry, lexem.text))
        .newline()
        .newline()
        .write("Current stats: ")
        .newline(2)
        .with((tb) => this.stats.display(tb))
        .build()
        .join("\n");

      return {
        type: "unknown-ukranian-word",
        lexem,
        message: errorMessage,
      };
    } else {
      return {
        type: "ok",
        lexems: possibleEntries,
      };
    }
  }
  collect<C extends { push(value: TAdvancedLexerResult<SourceLexem>): void }>(
    collection: C
  ): C {
    while (true) {
      const entry = this.next();
      if (entry.done) {
        break;
      }
      collection.push(entry.value);
    }
    return collection;
  }
}
