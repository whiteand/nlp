import { TType } from "../typescriptTypes";

export const RED_HEART_REACTION = "5098582486267462019";
export const EYE_DROP_REACTION = "5100672997174280859";
export const THUMB_UP_REACTION = "5100483636361167223";
export const HIGH_FIVE_REACTION = "4961194020136026755";

export const REACTION_TYPES = [
  "red-heart",
  "eye-drop",
  "thumb-up",
  "high-five",
] as const;
export type ReactionType = (typeof REACTION_TYPES)[number];

export const REACTION_TYPE_TYPE: TType = {
  type: "union",
  elements: REACTION_TYPES.map((e) => ({
    type: "stringLiteral",
    literal: e,
  })),
};

const reactionsToType = new Map<string, ReactionType>([
  [RED_HEART_REACTION, "red-heart"],
  [EYE_DROP_REACTION, "eye-drop"],
  [THUMB_UP_REACTION, "thumb-up"],
  [HIGH_FIVE_REACTION, "high-five"],
]);

export function parseReactionType(id: string): ReactionType {
  const res = reactionsToType.get(id);
  if (res == null) {
    throw new Error("Unknown reaction type: " + id);
  }
  return res;
}
