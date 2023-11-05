import { IFormatter } from "./IFormatter";
import { createColoredFormatter } from "./createColoredFormatter";

export type TType =
  | { type: "dictionary"; key: TType; value: TType }
  | { type: "record"; props: { [key: string]: TType } }
  | { type: "typeId"; id: string }
  | { type: "stringLiteral"; literal: string }
  | { type: "array"; item: TType }
  | { type: "union"; elements: TType[] }
  | "string"
  | "null"
  | "number";

function formatTypeSmart(t: TType, formatter: IFormatter): void {
  if (t === "number" || t === "string" || t === "null") {
    formatter.identifier(t);
    return;
  }
  if (t.type === "dictionary") {
    formatter
      .identifier("Record")
      .startAngle()
      .format(formatTypeSmart, t.key)
      .punctuation(", ")
      .format(formatTypeSmart, t.value)
      .endAngle();
    return;
  }
  if (t.type === "record") {
    formatter.startCurly();
    for (const prop of Object.keys(t.props)) {
      formatter
        .recordFieldName(prop)
        .punctuation(": ")
        .format(formatTypeSmart, t.props[prop])
        .punctuation("; ");
    }
    formatter.endCurly();
    return;
  }
  if (t.type === "typeId") {
    formatter.identifier(t.id);
    return;
  }
  if (t.type === "array") {
    if (typeof t.item === "string" || t.item.type === "typeId") {
      formatter.format(formatTypeSmart, t.item).startBracket().endBracket();
      return;
    }
    formatter
      .identifier("Array")
      .startAngle()
      .format(formatTypeSmart, t.item)
      .endAngle();
    return;
  }
  if (t.type === "stringLiteral") {
    formatter.stringLiteral(t.literal);
    return;
  }
  if (t.type === "union") {
    if (t.elements.length === 0) {
      formatter.identifier("never");
      return;
    }
    if (t.elements.length === 1) {
      formatter.format(formatTypeSmart, t.elements[0]);
      return;
    }
    if (
      t.elements.every(
        (t) =>
          typeof t === "string" ||
          t.type === "typeId" ||
          t.type === "stringLiteral"
      )
    ) {
      formatter.format(formatTypeSmart, t.elements[0]);
      for (let i = 1; i < t.elements.length; i++) {
        formatter.punctuation(" | ").format(formatTypeSmart, t.elements[i]);
      }
      return;
    }
    formatter.punctuation("(");
    formatter.format(formatTypeSmart, t.elements[0]);
    for (let i = 1; i < t.elements.length; i++) {
      formatter.punctuation(" | ").format(formatTypeSmart, t.elements[i]);
    }
    formatter.punctuation(")");
    return;
  }
  throw new Error("unkonwn type " + JSON.stringify(t as any));
}

export function formatType(t: TType) {
  return createColoredFormatter().format(formatTypeSmart, t).toString();
}
