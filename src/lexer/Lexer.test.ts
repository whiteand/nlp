import { test } from "bun:test";
import { CharIter } from "../CharIter";
import { Lexer } from "./Lexer";

test("opportunità to be correctly lexed", () => {
  const lexer = new Lexer(
    new CharIter(
      "Moldova și Ucraina sunt nu doar state vecine, dar și partenere de încredere. Vom continua să consolidăm cooperarea dintre țările noastre și împreună să contracarăm provocările Rusiei."
    )
  );
  const lexems = [...lexer];
  console.log(lexems);
});
