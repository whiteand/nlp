export interface IFormatter {
  identifier(s: string): this;
  recordFieldName(s: string): this;
  startCurly(): this;
  format<T>(cb: (value: T, formatter: IFormatter) => void, value: T): this;
  endCurly(): this;
  startAngle(): this;
  stringLiteral(literal: string): this;
  startBracket(): this;
  endBracket(): this;
  endAngle(): this;
  punctuation(value: string): this;
  toString(): string;
}
