import { Lexem } from "../../lexer/Lexem";
import { FullLexem } from "./types";
import {
  TUkrainianCase,
  TUkrainianWordDetails,
  UKRAINIAN_CASES,
  UKRAINIAN_GENDERS,
  UKRAINIAN_NUMBERS,
  UKRAINIAN_PERSONS,
  UKRAINIAN_VOICES,
} from "./ukrainian-types";

function compareStringAToZ(a: string, b: string): 1 | -1 | 0 {
  return a === b ? 0 : a > b ? 1 : -1;
}
function compareStringAToZCaseInsensitive(a: string, b: string): 1 | -1 | 0 {
  return compareStringAToZ(a.toLowerCase(), b.toLowerCase());
}
function compareNumberAsc(a: number, b: number): 1 | -1 | 0 {
  return a === b ? 0 : a > b ? 1 : -1;
}

function compareOrder<T>(order: readonly T[], a: T, b: T): 1 | -1 | 0 {
  const aInd = order.indexOf(a);
  const bInd = order.indexOf(b);
  if (aInd < 0 && bInd < 0) return 0;
  if (aInd < 0) return 1;
  if (bInd < 0) return -1;
  return compareNumberAsc(aInd, bInd);
}

const WORD_TYPE_ORDER: readonly TUkrainianWordDetails["type"][] = [
  "noun",
  "verb",
  "numeral",
  "adjective",
  "adverb",
  "pronoun",
  "preposition",
  "conjunction",
  "particle",
];
function compareUkrainianWords(
  a: TUkrainianWordDetails,
  b: TUkrainianWordDetails
) {
  if (a.base === b.base) {
    if (a.type !== b.type) {
      return compareOrder(WORD_TYPE_ORDER, a.type, b.type);
    }
    if (a.type === "noun" && b.type === "noun") {
      return (
        compareOrder(UKRAINIAN_NUMBERS, a.number, b.number) ||
        compareOrder(UKRAINIAN_GENDERS, a.gender, b.gender) ||
        compareOrder(UKRAINIAN_CASES, a.case, b.case) ||
        compareStringAToZCaseInsensitive(a.text, b.text)
      );
    }
    if (a.type === "verb" && b.type === "verb") {
      return (
        compareOrder(UKRAINIAN_VOICES, a.voice, b.voice) ||
        compareOrder(UKRAINIAN_GENDERS, a.gender, b.gender) ||
        compareOrder(UKRAINIAN_PERSONS, a.person, b.person) ||
        compareOrder(UKRAINIAN_NUMBERS, a.number, b.number) ||
        compareStringAToZCaseInsensitive(a.text, b.text)
      );
    }
    if (a.type === "numeral" && b.type === "numeral") {
      return (
        compareOrder(UKRAINIAN_NUMBERS, a.number, b.number) ||
        compareOrder(UKRAINIAN_GENDERS, a.gender, b.gender) ||
        compareOrder(UKRAINIAN_CASES, a.case, b.case) ||
        compareStringAToZCaseInsensitive(a.text, b.text)
      );
    }
    if (a.type === "adjective" && b.type === "adjective") {
      return (
        compareOrder(UKRAINIAN_NUMBERS, a.number, b.number) ||
        compareOrder(UKRAINIAN_GENDERS, a.gender, b.gender) ||
        compareOrder(UKRAINIAN_CASES, a.case, b.case) ||
        compareStringAToZCaseInsensitive(a.text, b.text)
      );
    }
    if (a.type === "adverb" && b.type === "adverb") {
      return compareStringAToZCaseInsensitive(a.text, b.text);
    }
    if (a.type === "pronoun" && b.type === "pronoun") {
      return (
        compareOrder(UKRAINIAN_NUMBERS, a.number, b.number) ||
        compareOrder(UKRAINIAN_GENDERS, a.gender, b.gender) ||
        compareOrder(UKRAINIAN_CASES, a.case, b.case) ||
        compareStringAToZCaseInsensitive(a.text, b.text)
      );
    }
    if (a.type === "preposition" && b.type === "preposition") {
      return compareStringAToZCaseInsensitive(a.text, b.text);
    }
    if (a.type === "conjunction" && b.type === "conjunction") {
      return compareStringAToZCaseInsensitive(a.text, b.text);
    }
    if (a.type === "particle" && b.type === "particle") {
      return compareStringAToZCaseInsensitive(a.text, b.text);
    }
    return 0;
  }
  return compareStringAToZCaseInsensitive(a.base, b.base);
}
export function compareFullLexems(a: FullLexem<Lexem>, b: FullLexem<Lexem>) {
  if (a.type === "ukrainian-word" && b.type === "ukrainian-word") {
    return compareUkrainianWords(a.details, b.details);
  }
  if (a.type === "ukrainian-word") {
    return -1;
  }
  if (b.type === "ukrainian-word") {
    return 1;
  }
  return compareStringAToZCaseInsensitive(a.lexem.text, b.lexem.text);
}
