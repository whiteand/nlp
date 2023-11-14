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

export interface ILexemEntry {
  type: Lexem["type"];
  text: Lexem["text"];
  count: number;
}
