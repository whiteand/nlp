import { IPeakable } from "../IPeakable";
import { ISkipable } from "../ISkipable";
import colors from "colors/safe";
import { EMOJIS } from "../EMOJIS";
import { charCodeSetsCache } from "../charCodeSetsCache";
import { Lexem } from "./Lexem";

const ITALIAN_LETTERS = charCodeSetsCache.for(
  "àèéìíîòóùúAaNnBbOoCcPpDdQqEeRrFfSsGgTtHhUuIiVvJjWwKkXxLlYyMmZz"
);
const DUTCH_LETTERS = charCodeSetsCache.for("DevrschiïkljognOadutTfpwNmbZLz");
const GERMAN_LETTERS = charCodeSetsCache.for(
  "abcdefghijklmnopqrstuvwxyzäÄöÖüÜßABCDEFGHIJKLMNOPQRSTUVWXYZ"
);
const ROMANIAN_LETTERS = charCodeSetsCache.for(
  "AaĂăÂâBbCcDdEeFfGgHhIiÎîJjKkLlMmNnOoPpQqRrSsȘșTtȚțUuVvWwXxYyZz"
);
const ICELANDIC_LETTERS = charCodeSetsCache.for("ÞórdísGylfa");
const TATRIAN_AND_TURKISH_LETTERS = charCodeSetsCache.for(
  "sitıQblTrKuyEşokelUAHzadmYñğçnü"
);
const LATVIAN_LETTERS = charCodeSetsCache.for(
  "aābcčdeēfgģhiījkķlļmnņoprsštuūvzžAĀBCČDEĒFGĢHIĪJKĶLĻMNŅOPRSŠTUŪVZŽ"
);

const LITHUANIAN_LETTERS = charCodeSetsCache.for(
  "aąbcčdeęėfghiįyjklmnoprsštuųūvzžAĄBCČDEĘĖFGHIĮYJKLMNOPRSŠTUŲŪVZŽ"
);
const NORWEGIAN_LETTERS = charCodeSetsCache.for("StjnBdskovreø");
const CROATIAN_LETTERS = charCodeSetsCache.for(
  "abcčćddžđefghijklljmnnjoprsštuvzžABCČĆDDŽĐEFGHIJKLLJMNNJOPRSŠTUVZŽ"
);
const SLOVAK_LETTERS = charCodeSetsCache.for(
  "aáäbcčdďdzdžeéfghchiíjklĺľmnňoóôpqrŕsštťuúvwxyýzžAÁÄBCČDĎDZDŽEÉFGHCHIÍJKLĹĽMNŇOÓÔPQRŔSŠTŤUÚVWXYÝZŽ"
);

function findAlphabetAndType(str: string): [Set<number>, Lexem["type"]] | null {
  for (const pair of SIMPLE_ALGORITHM_ALPHABETS) {
    const alphabet = pair[0];
    const type = pair[1];
    if (type === "italian-word" && str.startsWith("l'")) {
      if (containsOnlyLettersFrom(str.slice(2), alphabet)) return pair;
      continue;
    }
    if (containsOnlyLettersFrom(str, alphabet)) {
      return pair;
    }
  }
  return null;
}

function containsOnlyLettersFrom(str: string, alphabet: Set<number>): boolean {
  return str.split("").every((letter) => alphabet.has(letter.charCodeAt(0)));
}

type CharIter = Iterator<string> &
  IPeakable<string> &
  ISkipable & {
    slice(start: number, end: number): string;
    done(): boolean;
    save(): number;
    restore(n: number): void;
    startsWith(str: string): boolean;
    peekCharCodeAt(n?: number): number | null;
    matchesAt(n: number, ...s: Set<number>[]): boolean;
  };

const ENGLISH_LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
const ENGLISH_LETTERS = charCodeSetsCache.for(
  ENGLISH_LOWER_CASE + ENGLISH_LOWER_CASE.toUpperCase() + "á"
);
const UKRAINIAN_LOWER_LETTERS = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";
const UKRAINIAN_LETTERS = charCodeSetsCache.for(
  UKRAINIAN_LOWER_LETTERS + UKRAINIAN_LOWER_LETTERS.toUpperCase()
);
const SPANISH_LETTERS = charCodeSetsCache.for("LóprandezA");

const POLISH_LETTERS = new Set(
  "AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻaąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż"
    .split("")
    .map((e) => e.charCodeAt(0))
);
const FRENCH_LETTERS = new Set(
  "ëêRapéAndíYLuFcsriSMbtehl".split("").map((e) => e.charCodeAt(0))
);
const CZECH_LETTERS = new Set("Lipavský".split("").map((e) => e.charCodeAt(0)));
const SWIDISH_LETTERS = new Set(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖabcdefghijklmnopqrstuvwxyzåäö"
    .split("")
    .map((e) => e.charCodeAt(0))
);
const HEBREW_LETTERS = charCodeSetsCache.for("נובתאףלימטחסגקכצרדםךץעשפזןה");
const DIGITS = charCodeSetsCache.for("0123456789");
const ENGLISH_SPECIAL_NUMERAL_ENDINGS = [
  ["1", "st"],
  ["2", "nd"],
  ["3", "rd"],
];
const WHITESPACES = charCodeSetsCache.for(
  [
    " ",
    "\n",
    "\t",
    "\r",
    String.fromCharCode(8203),
    String.fromCharCode(160),
  ].join("")
);
const RUSSIAN_ALPHABET = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
const RUSSIAN_LETTERS = charCodeSetsCache.for(
  RUSSIAN_ALPHABET + RUSSIAN_ALPHABET.toUpperCase()
);
const CYRILLIC_LETTERS = new Set([...RUSSIAN_LETTERS, ...UKRAINIAN_LETTERS]);
const LEXEM_SPECIALS = new Set([
  ...`,)!(#.•+_/–%*'$:’”";«“»-€&…?№`.split("").map((e) => e.charCodeAt(0)),
  8212,
]);

const UKRAINIAN_AFTER_NUMBERS = [
  "ти",
  "ту",
  "га",
  "гу",
  "річної",
  "річну",
  "річчям",
  "метровий",
  "річний",
  "річним",
  "річного",
  "кілометрова",
  "річна",
  "х",
  "річчя",
  "гривневій",
  "мільйонного",
  "крокової",
  "му",
  "ма",
  "м",
  "ю",
  "го",
  "ті",
  "тя",
  "та",
  "те",
  "ші",
  "тю",
  "шу",
  "ша",
  "й",
  "ї",
];
const MIXED_UKRAINIAN_WORDS = ["6-Б"];
const MAX_AFTER_NUMBERS_LEN = Math.max(
  ...UKRAINIAN_AFTER_NUMBERS.map((x) => x.length)
);
const SEPARATORS = new Set(
  [",", ".", "?", "-", "!", ";", "…", ":", "»"].map((e) => e.charCodeAt(0))
);
const NON_WORD_CHARACTER = new Set([
  ...WHITESPACES,
  ...SEPARATORS,
  '"'.charCodeAt(0),
]);

const HYPHENED_ENGLISH_WORD_WITH_NUMBER = [
  "COVID-19",
  "T-72",
  "S-300",
  "F-16",
  "C-300",
  "CV-90",
  "G-19",
  "BMP-1",
  "Minsks-3",
  "Su-25",
];
const SPECIAL_DIGIT_WORD_ENGLISH_WORDS = ["4GameChangers", "2BS"];
const MAX_SPECIAL_DIGIT_WORD_ENGLISH_WORD_LEN = Math.max(
  ...SPECIAL_DIGIT_WORD_ENGLISH_WORDS.map((x) => x.length)
);

const SPECIAL_ENGLISH_NUMBER_ENDINGS = [
  "-year-old",
  "-year",
  "-step",
  "-kilometer",
];
const MIXED_IDENTITY_NAMES = ["АрміяInform"];

const CONFUSING_WORDS: Array<[string, string, Lexem["type"]]> = [
  ["ü", "Habertürk", "tatarian-turkish-word"],
  ["ü", "Türkiye", "tatarian-turkish-word"],
  ["ü", "Türkiye's", "english-word"],
  ["ü", "Türkiye’s", "english-word"],
  ["ã", "João Lourenço", "angola-word"],
  ["č", "Lenarčič", "slovenian-word"],
  ["ó", "Embaló", "portuguese-word"],
  ["é", "José", "spanish-word"],
  ["ú", "Kolbrún", "icelandic-word"],
  ["ó", "Gylfadóttir", "icelandic-word"],
  ["č", "Kovačevski", "macedonian-word"],
  ["š", "Nataša", "slovenian-word"],
  ["ó", "López-Aranda", "spanish-word"],
  ["ü", "Khürelsükh", "mongolian-word"],
  ["í", "Katrín", "icelandic-word"],
];

const SIMPLE_ALGORITHM_ALPHABETS: Array<[Set<number>, Lexem["type"]]> = [
  [FRENCH_LETTERS, "french-word"],
  [GERMAN_LETTERS, "german-word"],
  [POLISH_LETTERS, "polish-word"],
  [ITALIAN_LETTERS, "italian-word"],
  [ROMANIAN_LETTERS, "romanian-word"],
  [CROATIAN_LETTERS, "croatian-word"],
  [CYRILLIC_LETTERS, "cyrillic-word"],
  [CZECH_LETTERS, "czech-word"],
  [HEBREW_LETTERS, "hebrew-word"],
  [ICELANDIC_LETTERS, "icelandic-word"],
  [LATVIAN_LETTERS, "latvian-word"],
  [LITHUANIAN_LETTERS, "lithuanian-word"],
  [NORWEGIAN_LETTERS, "norwegian-word"],
  [SLOVAK_LETTERS, "slovak-word"],
  [SPANISH_LETTERS, "spanish-word"],
  [SWIDISH_LETTERS, "swidish-word"],
  [DUTCH_LETTERS, "dutch-word"],
  [TATRIAN_AND_TURKISH_LETTERS, "tatarian-turkish-word"],
];

const PREDEFINED_LEXEMS: Lexem[] = [
  {
    type: "slovak-word",
    text: "Čaputová",
  },
];

export class Lexer implements Iterator<Lexem>, Iterable<Lexem> {
  private charIter: CharIter;
  constructor(charIter: CharIter) {
    this.charIter = charIter;
  }
  [Symbol.iterator](): Iterator<Lexem, any, undefined> {
    return this;
  }
  next(): IteratorResult<Lexem, any> {
    const charCode = this.charIter.peekCharCodeAt();
    if (!charCode) {
      return { value: "", done: true };
    }
    const char = String.fromCharCode(charCode);
    if (UKRAINIAN_LETTERS.has(charCode)) {
      return this.nextUkrainianWord();
    }
    if (ENGLISH_LETTERS.has(charCode)) {
      return this.nextEnglishWord();
    }
    if (WHITESPACES.has(charCode)) {
      return this.nextWhitespaces();
    }
    if (
      char === "#" &&
      this.charIter.matchesAt(1, ENGLISH_LETTERS, UKRAINIAN_LETTERS, DIGITS)
    ) {
      return this.nextHashtag();
    }

    if (LEXEM_SPECIALS.has(charCode)) {
      this.charIter.skip(char.length);
      return {
        value: { text: char, type: "special-character" },
        done: this.done(),
      };
    }
    if (DIGITS.has(charCode)) {
      return this.nextNumber();
    }
    const possiblePair = findAlphabetAndType(char);
    if (possiblePair) {
      return this.nextAlphabetLexem(possiblePair[0], possiblePair[1]);
    }
    if (EMOJIS.has(charCode)) {
      const emoji = String.fromCharCode(charCode);
      this.charIter.skip(emoji.length);
      return {
        value: { text: emoji, type: "emoji" },
        done: this.done(),
      };
    }

    if (char === "@" && this.charIter.matchesAt(1, ENGLISH_LETTERS)) {
      return this.nextMention();
    }

    for (const lexem of PREDEFINED_LEXEMS) {
      if (this.charIter.startsWith(lexem.text)) {
        this.charIter.skip(lexem.text.length);
        return this.getEntry(lexem);
      }
    }

    this.fail('Unexpected character: "' + char + '"' + `<${charCode}>`);
  }
  nextMention(): IteratorResult<Lexem, any> {
    const atCode = this.charIter.peekCharCodeAt(0);
    if (atCode == null) {
      return { value: undefined, done: true };
    }
    const atChar = String.fromCharCode(atCode);
    if (atChar !== "#") return { value: undefined, done: true };

    this.charIter.skip(atChar.length);
    let res = "@";

    while (true) {
      const charCode = this.charIter.peekCharCodeAt(0);
      if (charCode == null) {
        break;
      }
      const char = String.fromCharCode(charCode);
      if (
        ENGLISH_LETTERS.has(charCode) ||
        UKRAINIAN_LETTERS.has(charCode) ||
        DIGITS.has(charCode) ||
        "_,)".includes(char)
      ) {
        res += char;
        this.charIter.skip(char.length);
        continue;
      }

      if (WHITESPACES.has(charCode)) {
        break;
      }
      if (
        char === "." &&
        this.charIter.peekCharCodeAt(".".length) === " ".charCodeAt(0)
      ) {
        break;
      }
      this.fail("unexpected hashtag character: " + `${char}<${charCode}>`);
    }
    return {
      value: {
        type: "mention",
        text: res,
      },
      done: this.done(),
    };
  }
  nextHashtag(): IteratorResult<Lexem, any> {
    const hashCode = this.charIter.peekCharCodeAt(0);
    if (hashCode == null) {
      return { value: undefined, done: true };
    }
    const hash = String.fromCharCode(hashCode);
    if (hash !== "#") return { value: undefined, done: true };

    this.charIter.skip(hash.length);
    let res = "#";
    while (true) {
      const charCode = this.charIter.peekCharCodeAt(0);
      if (charCode == null) {
        break;
      }
      const char = String.fromCharCode(charCode);
      if (
        ENGLISH_LETTERS.has(charCode) ||
        UKRAINIAN_LETTERS.has(charCode) ||
        DIGITS.has(charCode) ||
        "_,!)".includes(char)
      ) {
        res += char;
        this.charIter.skip(char.length);
        continue;
      }

      if (WHITESPACES.has(charCode)) {
        break;
      }
      if (char === ".") {
        if (this.charIter.matchesAt(1, NON_WORD_CHARACTER)) break;
        const afterDotCharCode = this.charIter.peekCharCodeAt(1);
        if (afterDotCharCode == null) {
          break;
        }

        this.fail(
          "unexpected char after dot in hashtag: " + `${afterDotCharCode}`
        );
      }
      if (char === "." && this.charIter.peekCharCodeAt(1) == null) {
        break;
      }
      this.fail("unexpected hashtag character: " + `${char}<${charCode}>`);
    }
    return {
      value: {
        type: "hashtag",
        text: res,
      },
      done: this.done(),
    };
  }

  nextUrl(): IteratorResult<Lexem, any> {
    let res = "";
    const PROTOCOL = 1;
    const DOMAIN = 2;
    const PATHNAME = 3;
    const HASH = 4;
    const QUERY_KEY = 5;
    const QUERY_VALUE = 6;

    let state = PROTOCOL;
    while (true) {
      const charCode = this.charIter.peekCharCodeAt(0);
      if (charCode == null) {
        break;
      }
      const char = String.fromCharCode(charCode);
      if (char === " ") {
        break;
      }
      if (state === PROTOCOL) {
        if (ENGLISH_LETTERS.has(charCode)) {
          res += char;
          this.charIter.skip(char.length);
          continue;
        }
        if (char === ":" && this.charIter.slice(1, 3) === "//") {
          state = DOMAIN;
          this.charIter.skip(3);
          continue;
        }
        this.fail("Unexpected letter in url protocol: " + char);
      }
      if (state === DOMAIN) {
        if (
          ENGLISH_LETTERS.has(charCode) ||
          char === "." ||
          char === "-" ||
          DIGITS.has(charCode)
        ) {
          res += char;
          this.charIter.skip(1);
          continue;
        }
        if (char === "/") {
          state = PATHNAME;
          continue;
        }
        if (")".includes(char)) {
          break;
        }
        this.fail("Unexpected letter in url domain: " + char);
      }
      if (state === PATHNAME) {
        if (!res.endsWith("/") && char === "/") {
          res += char;
          this.charIter.skip(1);
          continue;
        }
        if (
          DIGITS.has(charCode) ||
          ENGLISH_LETTERS.has(charCode) ||
          char === "_"
        ) {
          res += char;
          this.charIter.skip(1);
          continue;
        }
        if (" \n\t\r".includes(char)) {
          break;
        }
        if (char === "#") {
          res += char;
          this.charIter.skip(1);
          state = HASH;
          continue;
        }
        if (char === "." && this.charIter.matchesAt(1, WHITESPACES)) {
          break;
        }
        if (char === "?") {
          state = QUERY_KEY;
          res += char;
          this.charIter.skip(1);
          continue;
        }
        this.fail("Unexpected letter in url pathname: '" + char + "'");
      }
      if (state === HASH) {
        if (char === "/") {
          res += char;
          this.charIter.skip(char.length);
          continue;
        }
        this.fail("Unexpected letter in url hash: '" + char + "'");
      }
      if (state === QUERY_KEY) {
        if (ENGLISH_LETTERS.has(charCode)) {
          res += char;
          this.charIter.skip(char.length);
          continue;
        }
        if (char === "=") {
          res += char;
          this.charIter.skip(char.length);
          state = QUERY_VALUE;
          continue;
        }
        this.fail("Unexpected letter in url query key: '" + char + "'");
      }
      if (state === QUERY_VALUE) {
        if (ENGLISH_LETTERS.has(charCode) || DIGITS.has(charCode)) {
          res += char;
          this.charIter.skip(char.length);
          continue;
        }
        if (char === "\n") {
          break;
        }
        this.fail("Unexpected letter in url query value: '" + char + "'");
      }
      this.fail("Unexpected state: " + state);
    }
    return this.getEntry({
      text: res,
      type: "url",
    });
  }
  nextEnglishWord(): IteratorResult<Lexem, any> {
    const start = this.charIter.save();
    if (this.charIter.slice(0, 4).startsWith("http")) {
      return this.nextUrl();
    }
    let res = "";
    loop: while (true) {
      const charCode = this.charIter.peekCharCodeAt(0);
      if (charCode == null) {
        break;
      }

      const char = String.fromCharCode(charCode);
      if (
        ENGLISH_LETTERS.has(charCode) ||
        char === "_" ||
        DIGITS.has(charCode)
      ) {
        res += char;
        this.charIter.skip(char.length);
        continue;
      }
      if (char === "-" && this.charIter.matchesAt(1, ENGLISH_LETTERS)) {
        res += char;
        this.charIter.skip(char.length);
        continue;
      }
      if ("’'‘".includes(char) && this.charIter.matchesAt(1, ENGLISH_LETTERS)) {
        res += char;
        this.charIter.skip(char.length);
        continue;
      }
      if (WHITESPACES.has(charCode)) {
        break;
      }
      if (",.:;/’)+…?'—\"”»!".includes(char)) {
        break;
      }
      if (char === "8" && res === "G" && this.charIter.peek(1).value === ",") {
        res += char;
        this.charIter.skip(1);
        continue;
      }
      if (char === "-") {
        if (this.charIter.matchesAt(1, UKRAINIAN_LETTERS)) {
          const checkpoint = this.charIter.save();
          this.charIter.skip(1);
          const ukrainianWordEntry = this.nextUkrainianWord();
          if (ukrainianWordEntry.value.text) {
            ukrainianWordEntry.value.text =
              res + "-" + ukrainianWordEntry.value.text;
            return ukrainianWordEntry;
          } else {
            this.charIter.restore(checkpoint);
          }
        }
        for (const mixed of HYPHENED_ENGLISH_WORD_WITH_NUMBER) {
          const parts = mixed.split("-");
          if (res !== parts[0]) continue;
          const rest = this.charIter.slice(1, parts[1].length + 1);
          if (rest !== parts[1]) continue;
          res += char + rest;
          this.charIter.skip(char.length + rest.length);
          continue loop;
        }
      }
      for (const confusingWordConfig of CONFUSING_WORDS) {
        const firstNotEnglishLetter = confusingWordConfig[0];
        if (char !== firstNotEnglishLetter) continue;
        const word = confusingWordConfig[1];
        if (!word.startsWith(res)) continue;
        const rest = word.slice(res.length);
        const restIter = this.charIter.slice(0, rest.length);
        if (restIter !== rest) continue;
        if (!this.charIter.matchesAt(rest.length, NON_WORD_CHARACTER)) continue;
        this.charIter.skip(rest.length);
        return this.getEntry({
          text: word,
          type: confusingWordConfig[2],
        });
      }
      const newTotal = res + char;
      const possiblePair = findAlphabetAndType(newTotal);
      if (possiblePair) {
        this.charIter.restore(start);
        return this.nextAlphabetLexem(possiblePair[0], possiblePair[1]);
      }
      if (EMOJIS.has(charCode)) {
        break;
      }

      this.fail(
        "Unexpected character in english word: " + `"${char}" <${charCode}>`
      );
    }
    return this.getEntry({
      text: res,
      type: "english-word",
    });
  }

  nextAlphabetLexem(
    alphabet: Set<number>,
    type: Lexem["type"]
  ): IteratorResult<Lexem, any> {
    const start = this.charIter.save();
    let res = "";
    if (type === "italian-word" && this.charIter.slice(0, 2) === `l'`) {
      res = `l'`;
      this.charIter.skip(2);
    }
    while (true) {
      const charCode = this.charIter.peekCharCodeAt(0);
      if (charCode == null) {
        break;
      }
      const char = String.fromCharCode(charCode);

      if (alphabet.has(charCode)) {
        res += char;
        this.charIter.skip(char.length);
        continue;
      }
      if (
        `’'‘`.includes(char) &&
        this.charIter.peekCharCodeAt(1) === "s".charCodeAt(0) &&
        this.charIter.matchesAt(2, NON_WORD_CHARACTER)
      ) {
        res += `'s`;
        this.charIter.skip(char.length + "s".length);
        return this.getEntry({
          text: res,
          type: "english-word",
        });
      }
      if (NON_WORD_CHARACTER.has(charCode)) {
        break;
      }

      for (const [alphabet, type] of SIMPLE_ALGORITHM_ALPHABETS) {
        if (containsOnlyLettersFrom(res + char, alphabet)) {
          this.charIter.restore(start);
          return this.nextAlphabetLexem(alphabet, type);
        }
      }

      this.fail(`Unexpected character in ${type}: '${char}' <${charCode}>`);
    }
    return this.getEntry({
      type: type,
      text: res,
    });
  }

  done(): boolean {
    return this.charIter.done();
  }
  fail(message: string): never {
    const pretext = this.charIter.slice(-10, 0);
    const pretextLastLineLength = pretext.split("\n").slice(-1)[0].length;
    const cursorStr =
      pretextLastLineLength === pretext.length
        ? "\n   " + " ".repeat(pretextLastLineLength) + "^"
        : "\n" + " ".repeat(pretextLastLineLength) + "^";
    throw new Error(
      `\nError occurred:\n  ` +
        colors.red(message) +
        "\nat position: " +
        this.charIter.save() +
        "\nText:\n  '" +
        colors.white(pretext) +
        colors.red(this.charIter.slice(0, 10)) +
        "'" +
        cursorStr
    );
  }
  private nextNumber(): IteratorResult<Lexem, any> {
    const beforeStart = this.charIter.save();
    let res = "";
    let hasDot = false;
    let dotPosition = -1;
    loop: while (true) {
      const charCode = this.charIter.peekCharCodeAt(0);
      if (charCode == null) {
        break;
      }
      const char = String.fromCharCode(charCode);
      if (DIGITS.has(charCode)) {
        res += char;
        this.charIter.skip(char.length);
        continue;
      }
      if (' \n»%:/?"–!)'.includes(char)) {
        break;
      }
      if (char === "-") {
        const afterHyphen = this.charIter.slice(1, MAX_AFTER_NUMBERS_LEN + 1);
        for (const ukrainianAfterNumber of UKRAINIAN_AFTER_NUMBERS) {
          if (afterHyphen.startsWith(ukrainianAfterNumber)) {
            this.charIter.restore(beforeStart);
            return this.nextShortUkrainianNumberWord();
          }
        }
        if (this.charIter.matchesAt(1, DIGITS)) {
          break;
        }
        for (const m of MIXED_UKRAINIAN_WORDS) {
          const parts = m.split("-");
          if (parts[0] !== res) continue;
          const rest = this.charIter.slice(1, parts[1].length + 1);
          if (rest !== parts[1]) continue;
          if (!this.charIter.matchesAt(parts[1].length + 1, NON_WORD_CHARACTER))
            continue;
          res += char + rest;
          this.charIter.skip(char.length + rest.length);
          return this.getEntry({
            text: res,
            type: "ukrainian-word",
          });
        }
        for (const specialEnglishEnding of SPECIAL_ENGLISH_NUMBER_ENDINGS) {
          if (
            this.charIter.slice(0, specialEnglishEnding.length) !==
            specialEnglishEnding
          )
            continue;
          if (
            !this.charIter.matchesAt(
              specialEnglishEnding.length,
              NON_WORD_CHARACTER
            )
          )
            continue;
          res += specialEnglishEnding;
          this.charIter.skip(specialEnglishEnding.length);
          return this.getEntry({
            text: res,
            type: "english-word",
          });
        }
      }
      if (
        char === "t" &&
        this.charIter.slice(0, 2) === "th" &&
        this.charIter.matchesAt(2, NON_WORD_CHARACTER)
      ) {
        this.charIter.skip(2);
        return this.getEntry({
          type: "english-numeral-word",
          text: res + "th",
        });
      }
      if (char === "K" && this.charIter.matchesAt(1, NON_WORD_CHARACTER)) {
        res += char;
        this.charIter.skip(1);
        return this.getEntry({
          type: "english-numeral-word",
          text: res,
        });
      }

      if (ENGLISH_LETTERS.has(charCode)) {
        for (const specialEndingPairs of ENGLISH_SPECIAL_NUMERAL_ENDINGS) {
          const specialLastDigit = specialEndingPairs[0];
          const ending = specialEndingPairs[1];
          if (char !== ending[0]) continue;
          if (!res.endsWith(specialLastDigit)) continue;
          if (this.charIter.slice(0, ending.length) !== ending) continue;
          if (!this.charIter.matchesAt(ending.length, NON_WORD_CHARACTER))
            continue;
          this.charIter.skip(ending.length);
          return this.getEntry({
            type: "english-numeral-word",
            text: res + ending,
          });
        }
      }

      if (
        char === "'" &&
        this.charIter.peek(1).value === "s" &&
        this.charIter.matchesAt(2, NON_WORD_CHARACTER)
      ) {
        this.charIter.skip(2);
        return this.getEntry({
          type: "english-numeral-word",
          text: res + "'s",
        });
      }
      if (char === "," && this.charIter.peek(1).value === " ") {
        break;
      }
      if (char === "." && this.charIter.peek(1).value === " ") {
        break;
      }
      if (
        (char === "." || char === ",") &&
        !hasDot &&
        this.charIter.matchesAt(1, DIGITS)
      ) {
        hasDot = true;
        dotPosition = this.charIter.save();
        res += char;
        this.charIter.skip(char.length);
        continue;
      }
      if (char === "," && hasDot && res.includes(",")) {
        this.charIter.restore(dotPosition);
        res = res.slice(0, res.indexOf(","));
        break;
      }
      if (char === "." && hasDot && res.includes(".")) {
        this.charIter.restore(dotPosition);
        res = res.slice(0, res.indexOf("."));
        break;
      }
      if (char === ".") {
        const nextCharCode = this.charIter.peekCharCodeAt(1);
        if (!nextCharCode || WHITESPACES.has(nextCharCode)) break;
      }
      if (char === "+" && this.charIter.matchesAt(1, NON_WORD_CHARACTER)) {
        res += char;
        this.charIter.skip(char.length);

        return this.getEntry({
          type: "number+",
          text: res,
        });
      }
      if (ENGLISH_LETTERS.has(charCode)) {
        const afterDigit = this.charIter.slice(
          0,
          MAX_SPECIAL_DIGIT_WORD_ENGLISH_WORD_LEN - res.length
        );
        for (const specialWord of SPECIAL_DIGIT_WORD_ENGLISH_WORDS) {
          if (!(res + afterDigit).startsWith(specialWord)) continue;
          if (
            !this.charIter.matchesAt(
              specialWord.length - res.length,
              NON_WORD_CHARACTER
            )
          )
            continue;
          this.charIter.skip(specialWord.length - res.length);
          return this.getEntry({
            type: "english-word",
            text: specialWord,
          });
        }
      }

      this.fail(`Unexpected character in number: '${char}'`);
    }
    return { value: { text: res, type: "number" }, done: this.done() };
  }
  // 15-ти
  private nextShortUkrainianNumberWord(): IteratorResult<Lexem, any> {
    let digits = "";
    let hyphen = false;
    let isEnding = false;
    let ending = "";
    loop: while (true) {
      const charCode = this.charIter.peekCharCodeAt(0);
      if (charCode == null) {
        break;
      }
      const char = String.fromCharCode(charCode);
      if (!hyphen && DIGITS.has(charCode)) {
        digits += char;
        this.charIter.skip(char.length);
        continue;
      }
      if (char === "-") {
        hyphen = true;
        this.charIter.skip(char.length);
        continue;
      }
      if (hyphen) {
        const afterHyphen = this.charIter.slice(0, MAX_AFTER_NUMBERS_LEN);
        for (const afterNumber of UKRAINIAN_AFTER_NUMBERS) {
          if (
            afterHyphen.startsWith(afterNumber) &&
            this.charIter.matchesAt(afterNumber.length, NON_WORD_CHARACTER)
          ) {
            ending += afterNumber;
            this.charIter.skip(afterNumber.length);
            break loop;
          }
        }
      }
      this.fail(`Unexpected character in short ukrainian number word`);
    }
    return this.getEntry({
      text: digits + "-" + ending,
      type: "ukrainian-numeral-word",
    });
  }
  private getEntry(value: Lexem): IteratorResult<Lexem, any> {
    if (this.done()) {
      return { value, done: true };
    } else {
      return { value, done: false };
    }
  }
  private nextWhitespaces(): IteratorResult<Lexem, any> {
    let res = "";
    while (true) {
      const charCode = this.charIter.peekCharCodeAt(0);
      if (charCode == null) {
        break;
      }
      const char = String.fromCharCode(charCode);
      if (!WHITESPACES.has(charCode)) break;

      res += char;
      this.charIter.skip(char.length);
    }
    return this.getEntry({
      text: res,
      type: "whitespace",
    });
  }
  private nextUkrainianWord(): IteratorResult<Lexem, any> {
    const start = this.charIter.save();
    let res = "";
    while (true) {
      const charCode = this.charIter.peekCharCodeAt(0);
      if (charCode == null) {
        break;
      }
      if (EMOJIS.has(charCode)) {
        break;
      }
      const char = String.fromCharCode(charCode);
      if (UKRAINIAN_LETTERS.has(charCode) || (res && DIGITS.has(charCode))) {
        res += char;
        this.charIter.skip(char.length);
        continue;
      }

      if (
        "’-‘'ʼ".includes(char) &&
        (this.charIter.matchesAt(1, UKRAINIAN_LETTERS) ||
          this.charIter.matchesAt(1, DIGITS))
      ) {
        res += "’";
        this.charIter.skip(char.length);
        continue;
      }
      if (WHITESPACES.has(charCode)) break;
      if (",)!.:»…?;/".includes(char)) break;
      if (CYRILLIC_LETTERS.has(charCode)) {
        this.charIter.restore(start);
        return this.nextAlphabetLexem(CYRILLIC_LETTERS, "cyrillic-word");
      }
      if (
        res &&
        char === "-" &&
        this.charIter.matchesAt(1, NON_WORD_CHARACTER)
      ) {
        res += char;
        this.charIter.skip(char.length);
        break;
      }
      for (const mixed of MIXED_IDENTITY_NAMES) {
        if (!mixed.startsWith(res)) continue;
        const restMixed = mixed.slice(res.length);
        const rest = this.charIter.slice(0, restMixed.length);
        if (restMixed !== rest) continue;
        if (!this.charIter.matchesAt(restMixed.length, NON_WORD_CHARACTER))
          continue;
        res += rest;
        this.charIter.skip(rest.length);
        return this.getEntry({
          text: res,
          type: "mixed-identity-word",
        });
      }
      this.fail(
        'Unexpected character in ukrainian word: "' +
          char +
          '"' +
          `<${charCode}>`
      );
    }
    return { value: { text: res, type: "ukrainian-word" }, done: this.done() };
  }
}
