import { ICommand } from "../../App/types";
import { readBetterMessagesFromFile } from "../../telegram/readBetterMessagesFromFile";
import { renderContentToPlainText } from "../../telegram/renderContentToPlainText";
import colors from "colors/safe";
import { TType, formatType } from "../../typescriptTypes";
import { REACTION_TYPE_TYPE } from "../../telegram/reactions";
import { TextBuilder } from "../../TextBuilder";

export async function telegramPrint(filePath: string): Promise<void> {}

function g(s: string): string {
  return colors.gray(s);
}

const TelegramPostType: TType = {
  type: "record",
  props: {
    id: "string",
    time: "string",
    edited: {
      type: "union",
      elements: ["string", "null"],
    },
    original: {
      type: "union",
      elements: ["string", "null"],
    },
    views: "number",
    reactions: {
      type: "array",
      item: {
        type: "record",
        props: {
          type: REACTION_TYPE_TYPE,
          id: "string",
          count: "number",
        },
      },
    },
    content: {
      type: "array",
      item: {
        type: "typeId",
        id: "TContent",
      },
    },
  },
};

const TContentType: TType = {
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

export const TELEGRAM_PRINT_COMMAND: ICommand = {
  name: "telegram-print",
  help() {
    return {
      message: [
        `${g("Usage:")} telegram-print <filePath>`,
        g(`Example:`),
        '  telegram-print "data.json"',
        `${g("Read more ")}"help telegram-print format"${g(
          " to read about json file format"
        )}`,
      ],
      children: {
        format: {
          message: new TextBuilder({ width: 80 })
            .gray("In telegram-print commands we are expecting such format:")
            .newline(2)
            .writeType({
              type: "array",
              item: { type: "typeId", id: "TelegramPost" },
            })
            .newline(0)
            .gray("Where BetterPostType is such type:")
            .newline(2)
            .writeType(TelegramPostType)
            .newline(0)
            .gray("TContent is:")
            .newline(2)
            .writeType(TContentType)
            .build(),
        },
      },
    };
  },
  async run([filePath]) {
    const messages = await readBetterMessagesFromFile(filePath);

    for (const m of messages) {
      const text = renderContentToPlainText(m.content);
      process.stdout.write(text + "\n\n");
    }
  },
  shortHelpInGlobalHelp(tb) {
    tb.write("telegram-print <filePath>")
      .space()
      .gray("-")
      .space()
      .gray(
        "prints all telegram messages as a plain texts separating each message witht two new lines"
      );
  },
};
