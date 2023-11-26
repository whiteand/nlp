export type ZrozumiloWebsocketMessage =
  | {
      type: "get";
      resource: "dictionary";
      id: string;
      params: { skip: number; take: number };
    }
  | {
      type: "dictionary-response";
      requestId: string;
      words: { text: string; base: string; id: string }[];
    }
  | {
      type: "cancel";
      id: string;
    };
