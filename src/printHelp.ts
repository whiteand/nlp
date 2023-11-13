import colors from "colors/safe";
import { chooseSimilar } from "./chooseSimilar";
import { ILogger } from "./createLogger";
import { TType, formatType } from "./typescriptTypes";
import { REACTION_TYPE_TYPE } from "./telegram/reactions";

interface IHelpNode {
  message: string[];
  children?: Record<string, IHelpNode>;
}

function g(s: string): string {
  return colors.gray(s);
}

const messagesDictType: TType = {
  type: "dictionary",
  key: {
    type: "typeId",
    id: "MessageId",
  },
  value: {
    type: "typeId",
    id: "IMessage",
  },
};

const IRawMessageType: TType = {
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
};

const HELP_TREE: IHelpNode = {
  message: [
    `${g("Usage: ")} bun run <command> [options]`,
    `${g("Commands:")}`,
    `  help ${g("- Show instruction")}`,
    `  help <command>  ${g(`- Show help for a command`)}`,
    `  language-stats  ${g("- Shows different stats related to language.")}`,
    g('    Read more using "help language-stats" command.'),
    `  telegram-print <filePath>  ${g(
      "- prints all telegram message text finto the standard output."
    )}`,
    `  improve-telegram-messages <filePath>  ${g(
      "- parses dates and formatter numbers to single format."
    )}`,
    g('    Read more using "help improve-telegram-messages" command.'),
  ],
  children: {
    help: {
      message: [
        `${g("Usage: ")}help ${g("- shows full instruction")}`,
        g(`Example:`),
        `  help`,
        ``,
        `${g("Usage: ")}help <command>`,
        g(`Example:`),
        `  help language-stats`,
      ],
    },
    "telegram-print": {
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
          message: [
            g("In telegram-print commands we are expecting such format:"),
            `  ${formatType({
              type: "array",
              item: { type: "typeId", id: "TelegramPost" },
            })}`,
            g("Where BetterPostType is such type:"),
            `  ${formatType(TelegramPostType)}`,
            g("TContent is:"),
            `  ${formatType(TContentType)}`,
          ],
        },
      },
    },
    "language-stats": {
      message: [
        `${g("Usage:")} language-stats`,
        g(`Example:`),
        '  echo "Hello" | language-stats',
      ],
    },
    "improve-telegram-messages": {
      message: [
        `${g("Usage:")} improve-telegram-messages <filePath>`,
        g(`Example:`),
        '  improve-telegram-messages "data.json"',
        `${g("Read more ")}"help improve-telegram-messages format"${g(
          " to read about json file format"
        )}`,
      ],
      children: {
        format: {
          message: [
            g(
              "In improve-telegram-messages commands we are expecting such format:"
            ),
            `  ${formatType(messagesDictType)}`,
            g("Where MessageId is a string, IMessage is such type:"),
            `  ${formatType(IRawMessageType)}`,
            g("TContent is:"),
            `  ${formatType(TContentType)}`,
          ],
        },
      },
    },
  },
};

function getAllPaths(node: IHelpNode): string[][] {
  const res: string[][] = [];
  const tasks = [{ node, path: [] as string[] }];
  while (tasks.length > 0) {
    const { node, path } = tasks.pop()!;
    res.push(path);
    if (!node.children) continue;

    for (const key in node.children) {
      tasks.push({ node: node.children[key], path: [...path, key] });
    }
  }

  return res;
}

export function printHelp(logger: ILogger, helpPath: string[]): void {
  const node = helpPath.reduce<IHelpNode | undefined>(
    (acc, pathElement) => acc?.children?.[pathElement],
    HELP_TREE
  );

  if (!node) {
    const paths = getAllPaths(HELP_TREE);
    const mostSimilar = chooseSimilar(
      helpPath.join(" "),
      paths.map((path) => path.join(" "))
    );
    logger.log("Unknown command:", helpPath.join(" "));
    logger.log("Did you mean: 'help " + mostSimilar + "'?");
    return;
  }
  for (const line of node.message) {
    logger.log(line);
  }
}
