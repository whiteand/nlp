import { IPeakable } from "./IPeakable";
import { ISkipable } from "./ISkipable";
import colors from "colors/safe";

export type Lexem = {
  text: string;
  type:
    | "whitespace"
    | "ukrainian-word"
    | "ukrainian-numeral-word"
    | "english-word"
    | "hebrew-word"
    | "number"
    | "url"
    | "special-character";
};

type CharIter = Iterator<string> &
  IPeakable<string> &
  ISkipable & {
    slice(start: number, end: number): string;
    done(): boolean;
    save(): number;
    restore(n: number): void;
  };

const ENGLISH_LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
const ENGLISH_LETTERS = ENGLISH_LOWER_CASE + ENGLISH_LOWER_CASE.toUpperCase();
const UKRAINIAN_LOWER_LETTERS = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";
const UKRAINIAN_LETTERS =
  UKRAINIAN_LOWER_LETTERS + UKRAINIAN_LOWER_LETTERS.toUpperCase();
const HEBREW_LETTERS = "נובתימןה";
const DIGITS = "0123456789";
const SPECIAL_CHARACTERS = "(){}[]:;,.+-*/%&|<>=~^!";

export class Lexer implements Iterator<Lexem> {
  private charIter: CharIter;
  constructor(charIter: CharIter) {
    this.charIter = charIter;
  }
  next(): IteratorResult<Lexem, any> {
    const charEntry = this.charIter.peek();
    if (charEntry.done) {
      return charEntry;
    }
    if (UKRAINIAN_LETTERS.includes(charEntry.value)) {
      return this.nextUkrainianWord();
    }
    if (ENGLISH_LETTERS.includes(charEntry.value)) {
      return this.nextEnglishWord();
    }
    if (" \n".includes(charEntry.value)) {
      return this.nextWhitespaces();
    }
    if (",)!.–$:«»-".includes(charEntry.value)) {
      this.charIter.skip(1);
      return {
        value: { text: charEntry.value, type: "special-character" },
        done: this.done(),
      };
    }
    if (DIGITS.includes(charEntry.value)) {
      return this.nextNumber();
    }
    if (HEBREW_LETTERS.includes(charEntry.value)) {
      return this.nextHebrewWord();
    }
    this.fail('Unexpected character: "' + charEntry.value + '"');
  }
  nextHebrewWord(): IteratorResult<Lexem, any> {
    let res = "";
    while (true) {
      const entry = this.charIter.peek();
      if (entry.done) {
        break;
      }
      if (HEBREW_LETTERS.includes(entry.value)) {
        res += entry.value;
        this.charIter.skip(1);
        continue;
      }
      if (", ".includes(entry.value)) {
        break;
      }
      this.fail("Unexpected character in hebrew word: '" + entry.value + "'");
    }
    return {
      value: {
        type: res,
        text: "hebrew-word",
      },
      done: this.done(),
    };
  }
  nextUrl(): IteratorResult<Lexem, any> {
    let res = "";
    const PROTOCOL = 1;
    const DOMAIN = 2;
    const PATHNAME = 3;

    let state = PROTOCOL;
    while (true) {
      const entry = this.charIter.peek();
      if (entry.done) {
        break;
      }
      if (entry.value === " ") {
        break;
      }
      if (state === PROTOCOL) {
        if (ENGLISH_LETTERS.includes(entry.value)) {
          res += entry.value;
          this.charIter.skip(1);
          continue;
        }
        if (entry.value === ":" && this.charIter.slice(1, 3) === "//") {
          state = DOMAIN;
          this.charIter.skip(3);
          continue;
        }
        this.fail("Unexpected letter in url protocol: " + entry.value);
      }
      if (state === DOMAIN) {
        if (ENGLISH_LETTERS.includes(entry.value) || entry.value === ".") {
          res += entry.value;
          this.charIter.skip(1);
          continue;
        }
        if (entry.value === "/") {
          state = PATHNAME;
          continue;
        }
        this.fail("Unexpected letter in url domain: " + entry.value);
      }
      if (state === PATHNAME) {
        if (!res.endsWith("/") && entry.value === "/") {
          res += entry.value;
          this.charIter.skip(1);
          continue;
        }
        if (
          DIGITS.includes(entry.value) ||
          ENGLISH_LETTERS.includes(entry.value)
        ) {
          res += entry.value;
          this.charIter.skip(1);
          continue;
        }
        if (" \n\t\r".includes(entry.value)) {
          break;
        }
        this.fail("Unexpected letter in url pathname: '" + entry.value + "'");
      }
      this.fail("Unexpected letter in url: " + entry.value);
    }
    return {
      value: {
        text: res,
        type: "url",
      },
      done: this.done(),
    };
  }
  nextEnglishWord(): IteratorResult<Lexem, any> {
    if (this.charIter.slice(0, 4).startsWith("http")) {
      return this.nextUrl();
    }
    let res = "";
    while (true) {
      const entry = this.charIter.peek();
      if (entry.done) {
        break;
      }
      if (ENGLISH_LETTERS.includes(entry.value)) {
        res += entry.value;
        this.charIter.skip(1);
        continue;
      }
      if (entry.value === " ") {
        break;
      }

      this.fail("Not implemented yet");
    }
    return {
      value: {
        text: res,
        type: "english-word",
      },
      done: this.done(),
    };
  }
  done(): boolean {
    return this.charIter.done();
  }
  fail(message: string): never {
    throw new Error(
      `\nError occurred:\n  ` +
        colors.red(message) +
        "\nat position: " +
        this.charIter.save() +
        "\nText:\n  '" +
        colors.white(this.charIter.slice(-10, 0)) +
        colors.red(this.charIter.slice(0, 10)) +
        "'"
    );
  }
  private nextNumber(): IteratorResult<Lexem, any> {
    const beforeStart = this.charIter.save();
    let res = "";
    while (true) {
      const entry = this.charIter.peek();
      if (entry.done) {
        return { value: res, done: true };
      }
      if (DIGITS.includes(entry.value)) {
        res += entry.value;
        this.charIter.skip(1);
        continue;
      }
      if (entry.value === " ") {
        break;
      }
      if (entry.value === "-" && this.charIter.slice(0, 3) === "-ти") {
        this.charIter.restore(beforeStart);
        return this.nextShortUkrainianNumberWord();
      }
      if (entry.value === "," && this.charIter.peek(1).value === " ") {
        break;
      }
      this.fail(`Unexpected character in number: '${entry.value}'`);
    }
    return { value: { text: res, type: "number" }, done: this.done() };
  }
  // 15-ти
  private nextShortUkrainianNumberWord(): IteratorResult<Lexem, any> {
    let digits = "";
    let hyphen = false;
    let isEnding = false;
    let ending = "";
    while (true) {
      const entry = this.charIter.peek();
      if (entry.done) {
        return { value: null, done: true };
      }
      if (!hyphen && DIGITS.includes(entry.value)) {
        digits += entry.value;
        this.charIter.skip(1);
        continue;
      }
      if (entry.value === "-") {
        hyphen = true;
        this.charIter.skip(1);
        continue;
      }
      if (
        hyphen &&
        this.charIter.slice(0, 2) === "ти" &&
        this.charIter.peek(2).value === " "
      ) {
        ending += "ти";
        this.charIter.skip(2);
        break;
      }
      this.fail(`Unexpected character in short ukrainian number word`);
    }
    return {
      value: { text: digits + "-" + ending, type: "ukrainian-numeral-word" },
      done: this.done(),
    };
  }
  private nextWhitespaces(): IteratorResult<Lexem, any> {
    let res = "";
    while (true) {
      const entry = this.charIter.peek();
      if (entry.done) {
        break;
      }
      if (
        entry.value === " " ||
        entry.value === "\n" ||
        entry.value === "\t" ||
        entry.value === "\r"
      ) {
        res += entry.value;
        this.charIter.skip(1);
        continue;
      }
      if (UKRAINIAN_LETTERS.includes(entry.value)) {
        break;
      }
      if (ENGLISH_LETTERS.includes(entry.value)) {
        break;
      }
      if (HEBREW_LETTERS.includes(entry.value)) {
        break;
      }
      if (DIGITS.includes(entry.value)) {
        break;
      }
      if ("$–«-".includes(entry.value)) {
        break;
      }

      this.fail("unexpected token in whitespaces: '" + entry.value + "'");
    }
    return {
      value: {
        text: res,
        type: "whitespace",
      },
      done: this.done(),
    };
  }
  private nextUkrainianWord(): IteratorResult<Lexem, any> {
    let res = "";
    while (true) {
      const entry = this.charIter.peek();
      if (entry.done) {
        break;
      }
      if (UKRAINIAN_LETTERS.includes(entry.value)) {
        res += entry.value;
        this.charIter.skip(1);
        continue;
      }
      // if (entry.value === "–" && this.charIter.peek(1).value === " ") {
      //   break;
      // }
      if (
        (entry.value === "’" || entry.value === "-" || entry.value === "‘") &&
        UKRAINIAN_LETTERS.includes(this.charIter.peek(1).value)
      ) {
        res += entry.value;
        this.charIter.skip(1);
        continue;
      }
      if (" ,)!.:»".includes(entry.value)) break;
      this.fail(
        'Unexpected character in ukrainian word: "' + entry.value + '"'
      );
    }
    return { value: { text: res, type: "ukrainian-word" }, done: this.done() };
  }
}
