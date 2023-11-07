import { IPeakable } from "./IPeakable";

export class CharIter
  implements
    Iterable<string>,
    Iterator<string, any, undefined>,
    IPeakable<string>
{
  text: string;
  index: number;

  constructor(text: string) {
    this.text = text;
    this.index = 0;
  }
  done() {
    return this.index >= this.text.length;
  }
  save(): number {
    return this.index;
  }
  restore(ind: number) {
    this.index = ind;
  }

  skip(n: number) {
    if (n <= 0) return;
    this.index = Math.min(this.index + n, this.text.length);
  }
  slice(start: number, end: number) {
    return this.text.slice(Math.max(0, start + this.index), end + this.index);
  }
  startsWith(str: string) {
    return this.text.slice(this.index).startsWith(str);
  }
  matchesAt(n: number, ...s: Set<number>[]): boolean {
    const charCode = this.peekCharCodeAt(n);
    if (charCode === null) return false;
    for (let i = 0; i < s.length; i++) {
      if (s[i].has(charCode)) return true;
    }
    return false;
  }
  peekCharCodeAt(n: number = 0): number | null {
    const ind = this.index + n;
    if (ind >= this.text.length) return null;
    return this.text.charCodeAt(this.index + n);
  }
  next(): IteratorResult<string, any> {
    if (this.index >= this.text.length) {
      return { done: true, value: undefined };
    }
    const ind = this.index;
    this.index += 1;
    return { done: false, value: this.text[ind] };
  }
  peek(n: number = 0): IteratorResult<string, any> {
    const ind = this.index + n;
    if (ind >= this.text.length) {
      return { done: true, value: undefined };
    }
    return { done: false, value: this.text[ind] };
  }

  [Symbol.iterator](): Iterator<string, any, undefined> {
    return this;
  }
}
