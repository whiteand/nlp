import { TextBuilder } from "../../TextBuilder";

export interface IAdvancedLexerStats {
  onUkrainianLexem(): void;
  onLexem(text: string): void;
  display(tb: TextBuilder): void;
}
