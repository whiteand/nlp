import { ICommand } from "../../App/types";
import { TContentType } from "../../telegram/TContentType";
import { TextBuilder } from "../../TextBuilder";
import { readBetterMessagesFromFile } from "../../telegram/readBetterMessagesFromFile";
import { renderContentToPlainText } from "../../telegram/renderContentToPlainText";
import { formatCommand } from "../../formatCommand";

export const IMPROVE_TELEGRAM_MESSAGE_COMMAND: ICommand = {
  name: "improve-telegram-message",
  help() {
    return {
      message: new TextBuilder({ width: 80 })
        .gray("Usage:")
        .space()
        .write(this.name)
        .space()
        .write("<filePath>")
        .newline()
        .gray("Example:")
        .newline(2)
        .write(this.name)
        .space()
        .write('"data.json"')
        .newline(0)
        .gray("Read more:")
        .newline(2)
        .write('"')
        .write(formatCommand("help", this.name, "format"))
        .write('"')
        .newline(2)
        .gray("to read about json file format")
        .build(),
      children: {
        format: {
          message: new TextBuilder({ width: 80 })
            .gray("In")
            .space()
            .gray(this.name)
            .space()
            .gray("commands we are expecting such format:")
            .newline(2)
            .writeType({
              type: "dictionary",
              key: {
                type: "typeId",
                id: "MessageId",
              },
              value: {
                type: "typeId",
                id: "IMessage",
              },
            })
            .newline(0)
            .gray("Where MessageId is a string, IMessage is such type:")
            .newline(2)
            .writeType({
              type: "record",
              props: {
                id: "string",
                time: {
                  type: "union",
                  elements: ["string", "null"],
                },
                views: "string",
                reactions: {
                  type: "array",
                  item: {
                    type: "record",
                    props: {
                      id: "string",
                      count: "string",
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
            })
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
    tb.write(this.name)
      .space()
      .write("<filePath>")
      .space()
      .gray("-")
      .space()
      .pushCurrentAsTab(-10)
      .gray(
        `parses dates and formatter numbers to single format. Read more this command:`
      )
      .newline()
      .write('"' + formatCommand("help", this.name) + '"')
      .popTab();
  },
};
