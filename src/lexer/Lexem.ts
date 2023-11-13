import { ConsoleTable } from "../ConsoleTable";

export type Lexem = {
  text: string;
  type:
    | "whitespace"
    | "ukrainian-word"
    | "dutch-word"
    | "croatian-word"
    | "slovenian-word"
    | "italian-word"
    | "mongolian-word"
    | "portuguese-word"
    | "slovak-word"
    | "french-word"
    | "czech-word"
    | "latvian-word"
    | "german-word"
    | "spanish-word"
    | "romanian-word"
    | "tatarian-turkish-word"
    | "norwegian-word"
    | "mixed-identity-word"
    | "mention"
    | "angola-word"
    | "lithuanian-word"
    | "macedonian-word"
    | "swidish-word"
    | "ukrainian-numeral-word"
    | "english-word"
    | "icelandic-word"
    | "polish-word"
    | "english-numeral-word"
    | "hebrew-word"
    | "hashtag"
    | "number"
    | "number+"
    | "url"
    | "emoji"
    | "special-character"
    | "cyrillic-word"; // non ukrainian
};

export function isEqualLexem(a: Lexem, b: Lexem): boolean {
  return a.text === b.text && a.type === b.type;
}

interface IEntry<T> {
  item: T;
  count: number;
}

export class LexemsList implements Iterable<Lexem> {
  #length: number = 0;
  private countPerTextPerType: Map<Lexem["type"], Map<string, number>>;
  constructor(countPerTextPerType: Map<Lexem["type"], Map<string, number>>) {
    this.countPerTextPerType = countPerTextPerType;
    this.#length = [...countPerTextPerType.values()].reduce(
      (sum, texts) => sum + texts.size,
      0
    );
  }
  get length(): number {
    return this.#length;
  }
  static empty() {
    return new LexemsList(new Map());
  }
  static from(lexems: Iterable<Lexem>): LexemsList {
    const res = new LexemsList(new Map());
    for (const lexem of lexems) {
      res.push(lexem);
    }
    return res;
  }
  static fromSortedEntries(entries: Iterable<IEntry<Lexem>>): LexemsList {
    const cnt = new Map<Lexem["type"], Map<string, number>>();
    for (const entry of entries) {
      const texts = cnt.get(entry.item.type) || new Map();
      const c = texts.get(entry.item.text) || 0;
      const newC = c + entry.count;
      texts.set(entry.item.text, newC);
      cnt.set(entry.item.type, texts);
    }
    return new LexemsList(cnt);
  }
  *[Symbol.iterator](): Iterator<Lexem, any, undefined> {
    for (const typ of this.countPerTextPerType.keys()) {
      const cntByText = this.countPerTextPerType.get(typ);
      if (!cntByText) {
        continue;
      }
      for (const text of cntByText.keys()) {
        for (let i = 0, n = cntByText.get(text) || 0; i < n; i++) {
          yield { text, type: typ };
        }
      }
    }
  }

  *types(): Generator<Lexem["type"], any, undefined> {
    for (const type of this.countPerTextPerType.keys()) {
      yield type;
    }
  }

  *iterDesc(): Generator<Lexem, any, undefined> {
    for (const entry of this.getEntriesDesc()) {
      for (let j = 0, m = entry.count; j < m; j++) {
        yield entry.item;
      }
    }
  }
  selectByType(...types: Lexem["type"][]): LexemsList {
    const newMap = new Map<Lexem["type"], Map<string, number>>();
    for (const t of types) {
      const byText = this.countPerTextPerType.get(t);
      if (!byText) {
        continue;
      }
      newMap.set(t, byText);
    }
    return new LexemsList(newMap);
  }
  private *getEntries(): Generator<IEntry<Lexem>, any, undefined> {
    for (const type of this.countPerTextPerType.keys()) {
      const texts = this.countPerTextPerType.get(type);
      if (!texts) {
        continue;
      }
      for (const text of texts.keys()) {
        const cnt = texts.get(text) || 0;
        yield {
          item: { text, type },
          count: cnt,
        };
      }
    }
  }

  private getEntriesAsc(): IEntry<Lexem>[] {
    const entries = [...this.getEntries()];
    entries.sort((a, b) => b.count - a.count);
    return entries;
  }
  getEntriesDesc(): IEntry<Lexem>[] {
    const entries = [...this.getEntries()];
    entries.sort((a, b) => b.count - a.count);
    return entries;
  }
  toString(): string {
    const entries = this.getEntriesDesc();
    const consoleTable = new ConsoleTable<{
      type: string;
      text: string;
      count: number;
    }>()
      .withLabel("type", "Type")
      .withLabel("text", "Text")
      .withLabel("count", "Count");

    for (const entry of this.getEntriesDesc()) {
      consoleTable.push({
        type: entry.item.type,
        text: entry.item.text,
        count: entry.count,
      });
    }
    return consoleTable.toString();
  }
  filter(predicate: (entry: IEntry<Lexem>, lexemList: this) => boolean) {
    const entries: IEntry<Lexem>[] = [];
    let ind = 0;
    const it = this.getEntries();
    while (true) {
      const entry = it.next();
      if (entry.done) {
        break;
      }
      if (predicate(entry.value, this)) {
        entries.push(entry.value);
      }
      ind++;
    }
    return LexemsList.fromSortedEntries(entries);
  }
  sliceTop(start: number, end: number): LexemsList {
    return LexemsList.fromSortedEntries(
      this.getEntriesDesc().slice(start, end)
    );
  }
  sliceBottom(start: number, end: number): LexemsList {
    return LexemsList.fromSortedEntries(this.getEntriesAsc().slice(start, end));
  }
  push(lexem: Lexem): this {
    this.#length += 1;

    const cntByText = this.countPerTextPerType.get(lexem.type);
    if (!cntByText) {
      const newCntByText = new Map<string, number>();
      newCntByText.set(lexem.text, 1);
      this.countPerTextPerType.set(lexem.type, newCntByText);
      return this;
    }

    const cnt = cntByText.get(lexem.text);

    if (!cnt) {
      cntByText.set(lexem.text, 1);
      return this;
    }

    cntByText.set(lexem.text, cnt + 1);
    return this;
  }
}
