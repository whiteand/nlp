export type TContent =
  | { type: "text" | "strong" | "em"; text: string }
  | { type: "mention"; href: string; text: string }
  | { type: "anchor"; href: string; text: string }
  | { type: "emoji"; emoji: string }
  | { type: "hashtag"; hashtag: string };

export interface IReaction {
  id: string;
  count: string;
}

export interface IMessage {
  content: TContent[];
  id: string;
  time: string | null;
  views: string;
  reactions: IReaction[];
}
