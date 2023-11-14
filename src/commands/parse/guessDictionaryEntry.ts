import assert from "assert";
import { csvify } from "./csvify";
import { FullLexem, TUkrainianCase, TUkrainianWordDetails } from "./types";

const UKRAINIAN_DICTINARY_COLUMNS = [
  "text",
  "base",
  "type",
  "case",
  "number",
  "gender",
  "tense",
  "voice",
  "person",
];
function guessUkrainianNounCase(
  details: TUkrainianWordDetails,
  text: string
): TUkrainianCase {
  if (text.endsWith("ою")) {
    return "instrumental";
  }
  if (text.endsWith("им")) {
    return "instrumental";
  }
  return "nominative";
}
function guessUkrainianNounNumber(
  details: TUkrainianWordDetails,
  text: string
): "singular" | "plural" {
  if (text.endsWith("и")) return "plural";
  if (text.endsWith("і")) return "plural";
  if (text.endsWith("их")) return "plural";
  return "singular";
}
function guessUkrainianNounEntry(
  details: TUkrainianWordDetails & { type: "noun" },
  text: string
): TUkrainianWordDetails {
  const cs = guessUkrainianNounCase(details, text);
  const number = guessUkrainianNounNumber(details, text);
  return {
    type: "noun",
    base: details.base,
    case: cs,
    gender: details.gender,
    number,
    text,
  };
}
export function guessDictionaryEntry<
  SourceLexem extends { type: string; text: string }
>(similarEntry: FullLexem<SourceLexem>, text: string) {
  if (similarEntry.type === "ukrainian-word") {
    if (similarEntry.details.type === "noun") {
      const guessEntry = guessUkrainianNounEntry(similarEntry.details, text);
      assert(guessEntry.type === "noun", "Expected noun here");
      return csvify(
        {
          text: guessEntry.text,
          base: guessEntry.base,
          type: guessEntry.type,
          case: guessEntry.case,
          number: guessEntry.number,
          gender: guessEntry.gender,
        },
        {
          columns: UKRAINIAN_DICTINARY_COLUMNS,
        }
      );
    }
    if (similarEntry.details.type === "pronoun") {
      return csvify(
        {
          text: text,
          base: similarEntry.details.base,
          type: "pronoun",
          case: "nominative",
          number: "singular",
          gender: "masculine",
        },
        {
          columns: UKRAINIAN_DICTINARY_COLUMNS,
        }
      );
    }
    if (similarEntry.details.type === "conjunction") {
      return csvify(
        {
          text: text,
          base: similarEntry.details.base,
          type: similarEntry.details.type,
        },
        {
          columns: UKRAINIAN_DICTINARY_COLUMNS,
        }
      );
    }
    if (similarEntry.details.type === "particle") {
      return csvify(
        {
          text: text,
          base: similarEntry.details.base,
          type: similarEntry.details.type,
        },
        {
          columns: UKRAINIAN_DICTINARY_COLUMNS,
        }
      );
    }
    if (similarEntry.details.type === "verb") {
      return csvify(
        {
          ...similarEntry.details,
          text,
        },
        {
          columns: UKRAINIAN_DICTINARY_COLUMNS,
        }
      );
    }
    throw new Error(
      "Not implemented for ukrainian word " + JSON.stringify(similarEntry)
    );
  }
  throw new Error("Not implemented for " + JSON.stringify(similarEntry));
}
