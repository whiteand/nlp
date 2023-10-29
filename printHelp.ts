import { chooseSimilar } from "./chooseSimilar";
import { ILogger } from "./createLogger";

interface IHelpNode {
  message: string[];
  children?: Record<string, IHelpNode>;
}

const HELP_TREE: IHelpNode = {
  message: [
    "Usage: bun run <command> [options]",
    "Commands:",
    "  help - Show instruction",
    "  help <command> - Show help for a command",
    "  language-stats <filePath> - Shows different stats related to language.",
    '    Read more using "help language-stats" command.',
  ],
  children: {
    help: {
      message: [
        "Usage: help - shows full instruction",
        "Example:",
        "  help",
        "",
        "Usage: help <command>",
        "Example:",
        "  help language-stats",
      ],
    },
    "language-stats": {
      message: [
        "Usage: language-stats <filePath>",
        "Example:",
        '  language-stats "data.json"',
        'Read more "help language-stats format" to read about json file format',
      ],
      children: {
        format: {
          message: [
            "In language-stats commands we are expecting such format:",
            "  Record<MessageId, { message: string; time: string }>",
            "Where MessageId is a string, message is a string and time is a string of format:",
            "    25 October 2023, 12:17:40",
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
