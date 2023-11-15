import { TUkrainianWordDetails } from "./ukrainian-types";

export interface IUkrainianFullLexem {
  type: "ukrainian-word";
  details: TUkrainianWordDetails;
}
interface IRestLexems<L extends { type: string; text: string }> {
  type: "rest";
  lexem: L;
}
export type FullLexem<L extends { type: string; text: string }> =
  | IUkrainianFullLexem
  | IRestLexems<L>;

export interface ILexer {}

export interface IDictionary<L extends { type: string; text: string }> {
  get(word: string): FullLexem<L>[];
  values(): IterableIterator<FullLexem<L>>;
}
