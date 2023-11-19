import { TextBuilder } from "../../TextBuilder";
import { IAdvancedLexerStats } from "./IAdvancedLexerStats";

export class LexerStats implements IAdvancedLexerStats {
  ukrainianWordsNumber: number;

  private lexems: string[];

  constructor() {
    this.ukrainianWordsNumber = 0;
    this.lexems = [];
  }

  onLexem(text: string) {
    this.lexems.push(text);
  }

  onUkrainianLexem(): void {
    this.ukrainianWordsNumber++;
  }

  display(tb: TextBuilder): void {
    tb.pushCurrentAsTab()
      .write("Ukrainian words: ")
      .writeColored("green", this.ukrainianWordsNumber)
      .newline()
      .write("Context:")
      .newline(2)
      .writeColored("green", this.lexems.slice(-20, -1).join(""))
      .writeColored("red", this.lexems.at(-1) || "")
      .popTab();
  }
}
