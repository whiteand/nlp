import { Lexem } from "../../lexer/Lexem";
import { isEqualLexem } from "../../lexer/isEqualLexem";
import { FullLexem } from "./types";
import { TUkrainianWordDetails } from "./ukrainian-types";

export function isEqualUkrainianDetails(
  a: TUkrainianWordDetails,
  b: TUkrainianWordDetails
) {
  if (a.type === "adverb" && b.type === "adverb") {
    return a.base === b.base && a.text === b.text;
  }

  if (a.type === "adverb" || b.type === "adverb") return false;
  if (a.type === "preposition" && b.type === "preposition") {
    return a.base === b.base && a.text === b.text;
  }
  if (a.type === "preposition" || b.type === "preposition") return false;
  if (a.type === "particle" && b.type === "particle") {
    return a.base === b.base && a.text === b.text;
  }
  if (a.type === "particle" || b.type === "particle") return false;
  if (a.type === "conjunction" && b.type === "conjunction") {
    return a.base === b.base && a.text === b.text;
  }
  if (a.type === "conjunction" || b.type === "conjunction") return false;
  if (a.type === "verb" && b.type === "verb") {
    return (
      a.text === b.text &&
      a.base === b.base &&
      a.number === b.number &&
      a.gender === b.gender &&
      a.voice === b.voice &&
      a.person === b.person
    );
  }
  if (a.type === "verb" || b.type === "verb") return false;
  if (a.type === "noun" && b.type === "noun") {
    return (
      a.text === b.text &&
      a.case === b.case &&
      a.base === b.base &&
      a.number === b.number &&
      a.gender === b.gender
    );
  }
  if (a.type === "noun" || b.type === "noun") return false;
  if (a.type === "numeral" && b.type === "numeral") {
    return (
      a.text === b.text &&
      a.case === b.case &&
      a.base === b.base &&
      a.number === b.number &&
      a.gender === b.gender
    );
  }
  if (a.type === "numeral" || b.type === "numeral") return false;
  if (a.type === "adjective" && b.type === "adjective") {
    return (
      a.text === b.text &&
      a.case === b.case &&
      a.base === b.base &&
      a.number === b.number &&
      a.gender === b.gender
    );
  }
  if (a.type === "adjective" || b.type === "adjective") return false;
  if (a.type === "pronoun" && b.type === "pronoun") {
    return (
      a.text === b.text &&
      a.case === b.case &&
      a.base === b.base &&
      a.number === b.number &&
      a.gender === b.gender
    );
  }
  if (a.type === "pronoun" || b.type === "pronoun") return false;

  throw new Error("Unknown ukrainian details: " + JSON.stringify(a));
}

export function isEqualFullLexem(
  a: FullLexem<Lexem>,
  b: FullLexem<Lexem>
): boolean {
  if (a.type === "ukrainian-word" && b.type === "ukrainian-word") {
    return isEqualUkrainianDetails(a.details, b.details);
  }
  if (a.type === "rest" && b.type === "rest") {
    return isEqualLexem(a.lexem, b.lexem);
  }
  throw new Error("Unknown full lexem: " + JSON.stringify(a));
}
