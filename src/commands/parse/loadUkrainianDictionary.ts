import { readableStreamToText } from "bun";
import { Lexem } from "../../lexer/Lexem";
import {
  FullLexem,
  IDictionary,
  TUkrainianWordDetails,
  UKRAINIAN_CASES,
  UKRAINIAN_GENDERS,
  UKRAINIAN_NUMBERS,
  UKRAINIAN_PERSONS,
  UKRAINIAN_VOICES,
} from "./types";
import { parse } from "csv";
import { resolve } from "path";
import assert from "assert";

function parseDetails(v: Record<string, any>): TUkrainianWordDetails {
  if (v.type === "noun") {
    assert(typeof v.base === "string");
    assert(typeof v.text === "string");
    assert(UKRAINIAN_CASES.includes(v.case), "Unknown case: " + v.case);
    assert(UKRAINIAN_GENDERS.includes(v.gender), "Unknown gender: " + v.gender);
    assert(UKRAINIAN_NUMBERS.includes(v.number), "Unknown number: " + v.number);
    return {
      type: "noun",
      base: v.base,
      case: v.case,
      gender: v.gender,
      number: v.number,
      text: v.text,
    };
  }
  if (v.type === "conjunction") {
    assert(typeof v.base === "string");
    assert(typeof v.text === "string");
    return {
      type: "conjunction",
      base: v.base,
      text: v.text,
    };
  }
  if (v.type === "pronoun") {
    assert(typeof v.base === "string");
    assert(typeof v.text === "string");
    assert(UKRAINIAN_CASES.includes(v.case), "Unknown case: " + v.case);
    assert(UKRAINIAN_GENDERS.includes(v.gender), "Unknown gender: " + v.gender);
    assert(UKRAINIAN_NUMBERS.includes(v.number), "Unknown number: " + v.number);
    return {
      type: "pronoun",
      base: v.base,
      case: v.case,
      gender: v.gender,
      number: v.number,
      text: v.text,
    };
  }
  if (v.type === "adjective") {
    assert(typeof v.base === "string");
    assert(typeof v.text === "string");
    assert(UKRAINIAN_CASES.includes(v.case), "Unknown case: " + v.case);
    assert(UKRAINIAN_GENDERS.includes(v.gender), "Unknown gender: " + v.gender);
    assert(UKRAINIAN_NUMBERS.includes(v.number), "Unknown number: " + v.number);
    return {
      type: "adjective",
      base: v.base,
      case: v.case,
      gender: v.gender,
      number: v.number,
      text: v.text,
    };
  }
  if (v.type === "numeral") {
    assert(typeof v.base === "string");
    assert(typeof v.text === "string");
    assert(UKRAINIAN_CASES.includes(v.case), "Unknown case: " + v.case);
    assert(UKRAINIAN_GENDERS.includes(v.gender), "Unknown gender: " + v.gender);
    assert(UKRAINIAN_NUMBERS.includes(v.number), "Unknown number: " + v.number);
    return {
      type: "numeral",
      base: v.base,
      case: v.case,
      gender: v.gender,
      number: v.number,
      text: v.text,
    };
  }
  if (v.type === "particle") {
    assert(typeof v.base === "string");
    assert(typeof v.text === "string");
    return {
      type: "particle",
      base: v.base,
      text: v.text,
    };
  }
  if (v.type === "verb") {
    assert(typeof v.base === "string");
    assert(typeof v.text === "string");
    assert(UKRAINIAN_GENDERS.includes(v.gender), "Unknown gender: " + v.gender);
    assert(UKRAINIAN_NUMBERS.includes(v.number), "Unknown number: " + v.number);
    assert(UKRAINIAN_PERSONS.includes(v.person), "Unknown person: " + v.person);
    assert(UKRAINIAN_VOICES.includes(v.voice), "Unknown voice: " + v.voice);
    return {
      type: "verb",
      base: v.base,
      gender: v.gender,
      number: v.number,
      text: v.text,
      person: v.person,
      voice: v.voice,
    };
  }
  throw new Error(
    "Cannot understand dictionary value:\n  " + JSON.stringify(v, null, 2)
  );
}

export async function loadUkrainianDictionary(): Promise<IDictionary<Lexem>> {
  const uaPath = resolve(import.meta.dir, "ua.csv");
  const csvFile = Bun.file(uaPath);
  const content = await readableStreamToText(csvFile.stream());
  const dictionary: Map<string, FullLexem<Lexem>> = new Map();
  for await (const record of parse(content, {
    columns: true,
  })) {
    const details = parseDetails(record);
    dictionary.set(record.text, {
      type: "ukrainian-word",
      details: details,
    });
  }
  return {
    get(word: string) {
      if (!dictionary.has(word)) {
        return null;
      }
      const entry = dictionary.get(word);
      return entry!;
    },
    *values() {
      for (const entry of dictionary.values()) {
        yield entry;
      }
    },
  };
}
