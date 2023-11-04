import colors from "colors/safe";
import { chooseSimilar } from "./chooseSimilar";
import { ILogger } from "./createLogger";
import { TType, formatType } from "./typescriptTypes";

interface IHelpNode {
  message: string[];
  children?: Record<string, IHelpNode>;
}

function g(s: string) {
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
const IMessageType: TType = {
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
    `  language-stats <filePath>  ${g(
      "- Shows different stats related to language."
    )}`,
    g('    Read more using "help language-stats" command.'),
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
    "language-stats": {
      message: [
        `${g("Usage:")} language-stats <filePath>`,
        g(`Example:`),
        '  language-stats "data.json"',
        `${g("Read more ")}"help language-stats format"${g(
          " to read about json file format"
        )}`,
      ],
      children: {
        format: {
          message: [
            g("In language-stats commands we are expecting such format:"),
            `  ${formatType(messagesDictType)}`,
            g("Where MessageId is a string, IMessage is such type:"),
            `  ${formatType(IMessageType)}`,
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
