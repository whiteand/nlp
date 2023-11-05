import { IFormatter } from "./IFormatter";
import colors from "colors/safe";

export function createColoredFormatter(): IFormatter {
  let res = "";
  const formatter: IFormatter = {
    identifier(s) {
      res += colors.green(s);
      return this;
    },
    recordFieldName(f) {
      res += colors.cyan(f);
      return this;
    },
    startBracket() {
      res += colors.yellow("[");
      return this;
    },
    endBracket() {
      res += colors.yellow("]");
      return this;
    },
    startCurly() {
      res += colors.yellow("{ ");
      return this;
    },
    endCurly() {
      res += colors.yellow(" }");
      return this;
    },
    startAngle() {
      res += colors.yellow("<");
      return this;
    },
    endAngle() {
      res += colors.yellow(">");
      return this;
    },
    format(cb, value) {
      cb(value, this);
      return this;
    },
    stringLiteral(literal: string) {
      res += colors.dim(colors.yellow('"' + literal + '"'));
      return this;
    },
    punctuation(s) {
      res += s;
      return this;
    },
    toString() {
      return res;
    },
  };
  return formatter;
}
