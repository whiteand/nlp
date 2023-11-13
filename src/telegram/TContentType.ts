import { TType } from "../typescriptTypes";

export const TContentType: TType = {
  type: "union",
  elements: [
    {
      type: "record",
      props: {
        type: {
          type: "union",
          elements: [
            { type: "stringLiteral", literal: "text" },
            { type: "stringLiteral", literal: "strong" },
            { type: "stringLiteral", literal: "em" },
          ],
        },
        text: "string",
      },
    },
    {
      type: "record",
      props: {
        type: {
          type: "union",
          elements: [
            {
              type: "stringLiteral",
              literal: "mention",
            },
            {
              type: "stringLiteral",
              literal: "anchor",
            },
          ],
        },
        href: "string",
        text: "string",
      },
    },
    {
      type: "record",
      props: {
        type: {
          type: "stringLiteral",
          literal: "emoji",
        },
        emoji: "string",
      },
    },
    {
      type: "record",
      props: {
        type: {
          type: "stringLiteral",
          literal: "hashtag",
        },
        hashtag: "string",
      },
    },
  ],
};
