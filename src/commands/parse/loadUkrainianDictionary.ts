import { readableStreamToText } from "bun";
import { Lexem } from "../../lexer/Lexem";
import { assert as assertSmart, throwSmart } from "../../assert";
import { FullLexem, IDictionary } from "./types";
import {
  TUkrainianCase,
  TUkrainianNumber,
  TUkrainianWordDetails,
  UKRAINIAN_CASES,
  UKRAINIAN_GENDERS,
  UKRAINIAN_NUMBERS,
  UKRAINIAN_PERSONS,
  UKRAINIAN_VOICES,
} from "./ukrainian-types";
import { parse } from "csv";
import { resolve } from "path";
import assert from "assert";
import { chooseSimilar } from "../../chooseSimilar";

function assertSetValue<T extends string>(
  set: readonly T[],
  setName: string,
  value: any
): asserts value is T {
  if (set.includes(value)) return;
  throwSmart((tb) =>
    tb
      .write(`Unknown ${setName}: `)
      .writeColored("red", JSON.stringify(value))
      .newline()
      .write("Maybe you meant: ")
      .writeColored("green", chooseSimilar(value, set))
  );
}

function assertNumber(value: any): asserts value is TUkrainianNumber {
  assertSetValue(UKRAINIAN_NUMBERS, "number", value);
}

function assertCase(value: any): asserts value is TUkrainianCase {
  assertSetValue(UKRAINIAN_CASES, "case", value);
}

function parseDetails(v: Record<string, any>): TUkrainianWordDetails {
  if (v.type === "noun") {
    assert(typeof v.base === "string");
    assert(typeof v.text === "string");
    assertCase(v.case);
    assert(UKRAINIAN_GENDERS.includes(v.gender), "Unknown gender: " + v.gender);
    assertNumber(v.number);
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
    assertCase(v.case);
    assert(UKRAINIAN_GENDERS.includes(v.gender), "Unknown gender: " + v.gender);
    assertNumber(v.number);
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
    assertCase(v.case);
    assert(UKRAINIAN_GENDERS.includes(v.gender), "Unknown gender: " + v.gender);
    assertNumber(v.number);
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
    assertCase(v.case);
    assert(UKRAINIAN_GENDERS.includes(v.gender), "Unknown gender: " + v.gender);
    assertNumber(v.number);
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
  if (v.type === "preposition") {
    assert(typeof v.base === "string");
    assert(typeof v.text === "string");
    return {
      type: "preposition",
      base: v.base,
      text: v.text,
    };
  }
  if (v.type === "adverb") {
    assert(typeof v.base === "string");
    assert(typeof v.text === "string");
    return {
      type: "adverb",
      base: v.base,
      text: v.text,
    };
  }
  if (v.type === "verb") {
    assert(typeof v.base === "string");
    assert(typeof v.text === "string");
    assert(UKRAINIAN_GENDERS.includes(v.gender), "Unknown gender: " + v.gender);
    assertNumber(v.number);
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
  const dictionary: Map<string, FullLexem<Lexem>[]> = new Map();
  for await (const record of parse(content, {
    columns: true,
  })) {
    const details = parseDetails(record);
    const prevList = dictionary.get(record.text) ?? [];
    prevList.push({
      type: "ukrainian-word",
      details: details,
    });
    dictionary.set(record.text, prevList);
  }
  return {
    get(word: string) {
      return dictionary.get(word) || [];
    },
    *values() {
      for (const entries of dictionary.values()) {
        for (const entry of entries) {
          yield entry;
        }
      }
    },
  };
}
