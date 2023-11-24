import { readableStreamToText } from "bun";
import { Lexem } from "../../lexer/Lexem";
import { throwSmart } from "../../assert";
import { FullLexem, IDictionary, IUkrainianFullLexem } from "./types";
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
import { parse, stringify } from "csv";
import { resolve } from "path";
import assert from "assert";
import { chooseSimilar } from "../../chooseSimilar";
import { isEqualFullLexem } from "./isEqualFullLexem";
import { UKRAINIAN_DICTINARY_COLUMNS } from "./UKRAINIAN_DICTINARY_COLUMNS";

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
    assertSetValue(UKRAINIAN_VOICES, "voice", v.voice);
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

export class UkrainianDictionary implements IDictionary<Lexem> {
  private readonly dictionary: Map<string, FullLexem<Lexem>[]> = new Map();
  constructor() {
    this.dictionary = new Map();
  }
  add(word: string, lexems: FullLexem<Lexem>[]) {
    const prevList = this.dictionary.get(word) ?? [];
    nextLexem: for (const lexem of lexems) {
      for (const oldLexem of prevList) {
        if (isEqualFullLexem(oldLexem, lexem)) continue nextLexem;
      }
      prevList.push(lexem);
    }
    this.dictionary.set(word, prevList);
    return this;
  }
  get(word: string) {
    return this.dictionary.get(word) || [];
  }
  *values() {
    for (const entries of this.dictionary.values()) {
      for (const entry of entries) {
        yield entry;
      }
    }
  }
}

export const UK_DICTIONARY_PATH = resolve(import.meta.dir, "ua.csv");

export async function writeUkrainianDictionary(
  dict: IDictionary<Lexem>,
  filePath: string
): Promise<void> {
  const ukrainianDictionary = new UkrainianDictionary();
  const ukrainianLexems: IUkrainianFullLexem[] = [];
  for (const entry of dict.values()) {
    if (entry.type === "rest") continue;
    ukrainianLexems.push(entry);
    ukrainianDictionary.add(entry.details.text, [entry]);
  }
  ukrainianLexems.sort((a, b) => {
    if (a.details.base > b.details.base) return 1;
    if (a.details.base < b.details.base) return -1;
    return 0;
  });

  const data = await new Promise<string>((resolve, reject) => {
    stringify(
      ukrainianLexems.map((v) => v.details),
      {
        columns: UKRAINIAN_DICTINARY_COLUMNS,
        header: true,
        objectMode: true,
      },
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
  const file = Bun.file(filePath);
  Bun.write(file, data);
}

export async function loadUkrainianDictionary(): Promise<IDictionary<Lexem>> {
  const csvFile = Bun.file(UK_DICTIONARY_PATH);
  const content = await readableStreamToText(csvFile.stream());
  const res = new UkrainianDictionary();

  for await (const record of parse(content, {
    columns: true,
  })) {
    const details = parseDetails(record);
    res.add(record.text, [
      {
        type: "ukrainian-word",
        details: details,
      },
    ]);
  }
  return res;
}
