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

      const barChart = new ConsoleBarChart<{
        count: number;
        type: Lexem["type"];
      }>({
        rows: [],
        valueProp: "count",
      });

      for (const lexemType of lexems.types()) {
        barChart.push({
          count: lexems.selectByType(lexemType).length,
          type: lexemType,
        });
      }

      console.log(
        barChart.toString({
          labelProp: "type",
          collapseSmall: {
            label: "Others",
            minRatio: 0.1,
          },
        })
      );
    });
}
