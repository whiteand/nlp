import colors from "colors/safe";
import { TType, formatType, formatTypeSmart } from "./typescriptTypes";
import { IFormatter } from "./IFormatter";

interface IToStringer {
  toString(): string;
}

interface ISpan {
  fromLineIndex: number;
  fromLineOffset: number;
  toLineIndex: number;
  toLineOffset: number;
}

function isInSpan(span: ISpan, rowIndex: number, offset: number): boolean {
  if (span.fromLineIndex > rowIndex) return false;
  if (span.toLineIndex < rowIndex) return false;
  if (span.fromLineIndex === rowIndex && span.fromLineOffset > offset) {
    return false;
  }
  if (span.toLineIndex === rowIndex && span.toLineOffset <= offset) {
    return false;
  }
  return true;
}

function toColored(color: TColor | null, text: string): string {
  if (color == null) return text;
  return colors[color](text);
}

type TColor =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray"
  | "grey";

class TextBuilderTypeFormatter implements IFormatter {
  private builder: TextBuilder;
  constructor(textBuilder: TextBuilder) {
    this.builder = textBuilder;
  }
  startFieldType(): this {
    this.builder.space();
    return this;
  }
  startField(): this {
    this.builder.newline();
    return this;
  }
  endField(): this {
    return this;
  }
  startFieldList(): this {
    this.builder.tab(this.builder.tabLevel + 2);
    return this;
  }
  endFieldList(): this {
    this.builder.tab(Math.max(0, this.builder.tabLevel - 2));
    return this;
  }
  identifier(s: string): this {
    this.builder.writeColored("green", s);
    return this;
  }
  recordFieldName(s: string): this {
    this.builder.writeColored("cyan", s);
    return this;
  }
  startCurly(): this {
    this.builder.writeColored("yellow", "{");
    return this;
  }
  format<T>(cb: (value: T, formatter: IFormatter) => void, value: T): this {
    cb(value, this);
    return this;
  }
  endCurly(): this {
    this.builder.newline().writeColored("yellow", "}");
    return this;
  }
  startAngle(): this {
    this.builder.writeColored("yellow", "<");
    return this;
  }
  stringLiteral(literal: string): this {
    this.builder.writeColored("magenta", '"' + literal + '"');
    return this;
  }
  startBracket(): this {
    this.builder.writeColored("yellow", "[");
    return this;
  }
  endBracket(): this {
    this.builder.writeColored("yellow", "]");
    return this;
  }
  endAngle(): this {
    this.builder.writeColored("yellow", ">");
    return this;
  }
  punctuation(value: string): this {
    if (value === "; ") {
      this.builder.write(";").newline();
      return this;
    }
    this.builder.write(value);
    return this;
  }
  toString(): string {
    throw new Error("Method not implemented.");
  }
}

export class TextBuilder {
  res: string[];
  tabLevel: number;
  private colored: { span: ISpan; color: TColor }[];
  private baseTabLevel: number;
  private width: number;
  private tabSymbol = " ";
  private tabStacks: number[] = [];
  constructor({
    baseTabLevel,
    width,
  }: {
    baseTabLevel?: number;
    width?: number;
  }) {
    this.res = [];
    this.colored = [];
    this.width = width || 80;
    this.tabLevel = baseTabLevel || 0;
    this.baseTabLevel = baseTabLevel ?? 0;
  }
  get absoluteTabLevel() {
    return this.tabLevel + this.baseTabLevel;
  }
  get tabLength() {
    return this.tabSymbol.repeat(this.absoluteTabLevel).length;
  }

  private current(): string {
    return this.res[this.res.length - 1] || "";
  }

  pushCurrentAsTab(delta: number = 0): this {
    return this.pushTab(Math.max(0, this.current().length + delta));
  }

  pushTab(newTabLevel: number): this {
    const previousTabLevel = this.tabLevel;
    this.tabStacks.push(previousTabLevel);
    this.tabLevel = newTabLevel;
    return this;
  }
  popTab(): this {
    this.tabLevel = this.tabStacks.pop()!;
    if (this.tabLevel == null) {
      throw new Error("Cannot use popTab without using of pushTab before");
    }
    return this;
  }
  /**
   * You should ensure that you are not violating
   * the maximum width per line
   */
  private unsafeAppend(s: string): this {
    if (!s) return this;
    if (s === "\n") {
      this.res.push("");
      return this;
    }
    if (this.res.length <= 0) {
      this.res.push(s);
      return this;
    }
    this.res[this.res.length - 1] += s;
    return this;
  }

  write<T extends IToStringer>(object: T): this {
    const s = object.toString();
    if (!s) return this;
    if (s.indexOf("\n") >= 0) {
      this.pushCurrentAsTab();
      const parts = s.split("\n");
      this.write(parts[0]);
      for (let i = 1; i < parts.length; i++) {
        this.newline().write(parts[i]);
      }
      this.popTab();
      return this;
    }
    if (this.current().length + s.length <= this.width) {
      this.unsafeAppend(s);
      return this;
    }

    const words = s.split(" ");
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const prevSpaceWidth = i > 0 ? 1 : 0;
      if (this.current().length + prevSpaceWidth + word.length <= this.width) {
        if (prevSpaceWidth > 0) {
          this.unsafeAppend(" ");
        }
        this.unsafeAppend(word);
        continue;
      }
      this.newline();
      this.unsafeAppend(word);
    }
    return this;
  }
  private coords(): { line: number; offset: number } {
    if (this.res.length <= 0) {
      return { line: 0, offset: 0 };
    }
    const line = this.res.length - 1;
    const offset = this.res[line].length;
    return { line, offset };
  }

  private spanOf(cb: (builder: TextBuilder) => void): ISpan {
    const { line: fromLineIndex, offset: fromLineOffset } = this.coords();
    cb(this);
    const { line: toLineIndex, offset: toLineOffset } = this.coords();
    return {
      fromLineIndex,
      fromLineOffset,
      toLineIndex,
      toLineOffset,
    };
  }
  writeColored<T extends IToStringer>(color: TColor, text: T): this {
    const span = this.spanOf((builder) => builder.write(text.toString()));
    this.colored.push({
      span,
      color: color,
    });
    return this;
  }
  gray<T extends IToStringer>(s: T): this {
    return this.writeColored("gray", s);
  }
  space(): this {
    return this.write(" ");
  }
  newline(tabLevel?: number): this {
    if (tabLevel != null) {
      this.tab(tabLevel);
    }
    this.res.push("");
    return this.unsafeAppend(this.tabSymbol.repeat(this.absoluteTabLevel));
  }
  tab(level: number): this {
    this.tabLevel = level;
    return this;
  }
  reset(): this {
    this.tabLevel = this.baseTabLevel;
    return this;
  }
  writeType(t: TType): this {
    formatTypeSmart(t, new TextBuilderTypeFormatter(this));
    return this;
  }
  with(cb: (builder: TextBuilder) => void): this {
    cb(this);
    return this;
  }
  build(): string[] {
    const res: string[] = [];
    for (let i = 0; i < this.res.length; i++) {
      let line = this.res[i];
      const chars = line.split("");
      const charColors = chars.map((_, offset, arr) => {
        for (const { span, color } of this.colored) {
          if (!isInSpan(span, i, offset)) continue;
          return color;
        }
        return null;
      });
      let prevColor: TColor | null = null;
      let coloredLine = "";
      let currentColorPart = "";
      for (let j = 0; j < line.length; j++) {
        const char = chars[j];
        const color = charColors[j];
        if (color === prevColor) {
          currentColorPart += chars[j];
          continue;
        }
        coloredLine += toColored(prevColor, currentColorPart);
        currentColorPart = char;
        prevColor = color;
      }
      if (currentColorPart) {
        coloredLine += toColored(prevColor, currentColorPart);
      }
      res.push(coloredLine);
    }
    return res;
  }
}
