import { Lexem } from "./Lexem";

export function isEqualLexem(a: Lexem, b: Lexem): boolean {
  return a.text === b.text && a.type === b.type;
}
