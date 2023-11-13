import { Lexem, LexemsList } from "../../lexer/Lexem";
import { getLexemsFromContent } from "./getLexemsFromContent";
import { readBetterMessagesFromFile } from "../../telegram/readBetterMessagesFromFile";
import { ConsoleBarChart } from "../../ConsoleBarChart";
import { Lexer } from "../../lexer/Lexer";
import { CharIter } from "../../CharIter";

export async function languageStats(): Promise<void> {
  const chunks: Buffer[] = [];
  process.stdin
    .on("data", (data) => {
      chunks.push(data);
    })
    .on("end", () => {
      const content = Buffer.concat(chunks).toString("utf-8");
      const lexems = LexemsList.empty();
      const lexer = new Lexer(new CharIter(content));
      while (true) {
        const entry = lexer.next();
        if (entry.done) break;
        lexems.push(entry.value);
      }

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
      console.log();
      console.log("  Word Length");
      wordLengthBarChart.sort((a, b) => a.length - b.length);
      console.log(
        wordLengthBarChart.toString({
          labelProp: "length",
        })
      );
    });
}
