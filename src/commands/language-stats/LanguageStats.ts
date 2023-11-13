import { ICommand } from "../../App/types";
import { CharIter } from "../../CharIter";
import { ConsoleBarChart } from "../../ConsoleBarChart";
import { TextBuilder } from "../../TextBuilder";
import { Lexem, LexemsList } from "../../lexer/Lexem";
import { Lexer } from "../../lexer/Lexer";
import { streamToString } from "../../streamToString";

function printLexemTypes(lexems: LexemsList) {
  const lexemTypeBarChart = new ConsoleBarChart<{
    count: number;
    type: Lexem["type"];
  }>({
    rows: [],
    valueProp: "count",
  });

  for (const lexemType of lexems.types()) {
    lexemTypeBarChart.push({
      count: lexems.selectByType(lexemType).length,
      type: lexemType,
    });
  }

  lexemTypeBarChart.sort((a, b) => b.count - a.count);

  console.log("  Lexem types");
  console.log(
    lexemTypeBarChart.toString({
      labelProp: "type",
      collapseSmall: {
        label: "Others",
        minRatio: 0.01,
      },
    })
  );
}

function printLexemByLengthStats(lexems: LexemsList) {
  const wordLengthBarChart = new ConsoleBarChart<{
    count: number;
    length: number;
  }>({
    rows: [],
    valueProp: "count",
  });
  const numberByLength = new Map<number, number>();
  for (const lexemEntry of lexems.getEntriesDesc()) {
    const lexemLength = lexemEntry.item.text.length;
    const cnt = numberByLength.get(lexemLength) ?? 0;
    numberByLength.set(lexemLength, cnt + 1);
  }
  for (const [length, count] of numberByLength.entries()) {
    wordLengthBarChart.push({
      count,
      length,
    });
  }

  console.log("  Word Length");
  wordLengthBarChart.sort((a, b) => a.length - b.length);
  console.log(
    wordLengthBarChart.toString({
      labelProp: "length",
    })
  );
}

export const LANGUAGE_STATS_COMMAND: ICommand = {
  name: "language-stats",
  help() {
    return {
      message: new TextBuilder({ width: 80 })
        .gray("Usage: ")
        .write("language-stats")
        .newline()
        .gray("Example:")
        .newline(1)
        .write('echo "Hello" | language-stats')
        .newline()
        .build(),
    };
  },
  async run() {
    const content = await streamToString(process.stdin);

    const lexems = new Lexer(new CharIter(content)).collect(LexemsList.empty());

    printLexemTypes(lexems);

    console.log();

    printLexemByLengthStats(lexems);
  },
  shortHelpInGlobalHelp(textBuilder) {
    textBuilder
      .write("language-stats")
      .space()
      .gray("-")
      .space()
      .pushCurrentAsTab()
      .gray(
        "shows different stats related to language of the text passed in stdin."
      )
      .popTab()
      .newline();
  },
};
