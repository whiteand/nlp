export const UKRAINIAN_CASES = [
  "nominative",
  "accusative",
  "genitive",
  "dative",
  "instrumental",
  "locative",
  "vocative",
] as const;

export const UKRAINIAN_TENSE = [
  "infinitive",
  "past",
  "pluperfect",
  "present",
  "future",
] as const;
export type TUkrainianTense = (typeof UKRAINIAN_TENSE)[number];

export const UKRAINIAN_VOICES = ["active", "mediopassive"];
export type TUkrainianVoice = (typeof UKRAINIAN_VOICES)[number];
export const UKRAINIAN_PERSONS = ["first", "second", "third"] as const;
export type TUkrainianPerson = (typeof UKRAINIAN_PERSONS)[number];
export type TUkrainianCase = (typeof UKRAINIAN_CASES)[number];

export const UKRAINIAN_NUMBERS = ["singular", "plural"] as const;
export type TUkrainianNumber = (typeof UKRAINIAN_NUMBERS)[number];
export const UKRAINIAN_GENDERS = ["masculine", "feminine", "neuter"] as const;
export type TUkrainianGender = (typeof UKRAINIAN_GENDERS)[number];
export type TUkrainianWordDetails =
  | {
      type: "noun";
      text: string;
      case: TUkrainianCase;
      base: string;
      number: TUkrainianNumber;
      gender: TUkrainianGender;
    }
  | {
      type: "numeral";
      text: string;
      case: TUkrainianCase;
      base: string;
      number: TUkrainianNumber;
      gender: TUkrainianGender;
    }
  | {
      type: "adjective";
      text: string;
      case: TUkrainianCase;
      base: string;
      number: TUkrainianNumber;
      gender: TUkrainianGender;
    }
  | {
      type: "pronoun";
      text: string;
      case: TUkrainianCase;
      base: string;
      number: TUkrainianNumber;
      gender: TUkrainianGender;
    }
  | {
      type: "verb";
      text: string;
      base: string;
      number: TUkrainianNumber;
      gender: TUkrainianGender;
      voice: TUkrainianVoice;
      person: TUkrainianPerson;
    }
  | {
      type: "conjunction";
      text: string;
      base: string;
    }
  | {
      type: "particle";
      text: string;
      base: string;
    }
  | {
      type: "preposition";
      text: string;
      base: string;
    }
  | {
      type: "adverb";
      text: string;
      base: string;
    };

export function getUkrainianWordId(word: TUkrainianWordDetails) {
  const parts: string[] = [];
  if (word.type === "noun") {
    parts.push(
      "noun",
      word.gender,
      word.base,
      word.case,
      word.number,
      word.text
    );
  } else if (word.type === "conjunction") {
    parts.push("conj", word.base);
  } else if (word.type === "numeral") {
    parts.push(
      "numeral",
      word.gender,
      word.base,
      word.case,
      word.number,
      word.text
    );
  } else if (word.type === "adjective") {
    parts.push(
      "adjective",
      word.gender,
      word.base,
      word.case,
      word.number,
      word.text
    );
  } else if (word.type === "pronoun") {
    parts.push(
      "pronoun",
      word.gender,
      word.base,
      word.case,
      word.number,
      word.text
    );
  } else if (word.type === "verb") {
    parts.push(
      "verb",
      word.voice,
      word.gender,
      word.person,
      word.base,
      word.number,
      word.text
    );
  } else if (word.type === "adverb") {
    parts.push("adverb", word.base, word.text);
  } else if (word.type === "particle") {
    parts.push("particle", word.base, word.text);
  } else if (word.type === "preposition") {
    parts.push("preposition", word.base, word.text);
  } else {
    throw new Error("not handled word" + JSON.stringify(word, null, 2));
  }

  return parts.join("|");
}
