import { TextBuilder } from "../TextBuilder";
import { chooseSimilar } from "../chooseSimilar";
import { ILogger } from "../createLogger";
import { getAllPaths } from "./getAllPaths";
import { ICommand, IHelpNode } from "./types";

export class App {
  helpNode: IHelpNode;
  commands: Map<string, ICommand>;
  logger: ILogger;
  constructor({ logger }: { logger: ILogger }) {
    this.logger = logger;
    let that = this;
    this.helpNode = {
      get message() {
        return that.getGlobalHelp();
      },
      children: {},
    };
    this.commands = new Map();
  }
  private addGlobalHelpPoint(key: string, helpNode: IHelpNode) {
    if (!this.helpNode.children) {
      this.helpNode.children = {
        [key]: helpNode,
      };
      return;
    }
    this.helpNode.children[key] = helpNode;
  }

  registerCommand(command: ICommand): this {
    this.commands.set(command.name, command);
    this.addGlobalHelpPoint(command.name, command.help());
    return this;
  }
  async run(argv: string[]): Promise<void> {
    const command = argv.at(2);
    if (command === "help") {
      this.printHelp(Bun.argv.slice(3));
      return;
    }
    for (const commandName of this.commands.keys()) {
      if (command === commandName) {
        await this.commands.get(commandName)!.run(argv.slice(3));
        return;
      }
    }
    this.printHelp([]);
    process.exit(1);
  }
  print(cb: (textBuilder: TextBuilder) => void) {
    const textBuilder = new TextBuilder({ width: 80 });
    cb(textBuilder);
    for (const line of textBuilder.build()) {
      this.logger.log(line);
    }
  }

  printHelp(helpPath: string[]) {
    const node = helpPath.reduce<IHelpNode | undefined>(
      (acc, pathElement) => acc?.children?.[pathElement],
      this.helpNode
    );

    if (!node) {
      const paths = getAllPaths(this.helpNode);
      const mostSimilar = chooseSimilar(
        helpPath.join(" "),
        paths.map((path) => path.join(" "))
      );
      this.print((b) =>
        b
          .write("Unknown command: ")
          .write(helpPath.join(" "))
          .newline()
          .write("Did you mean:  ")
          .newline(2)
          .write('"help ')
          .write(mostSimilar)
          .write('"?')
          .newline(0)
      );
      return;
    }
    for (const line of node.message) {
      this.logger.log(line);
    }
  }
  getGlobalHelp(): string[] {
    const textBuilder = new TextBuilder({
      width: 80,
    })
      .gray("Usage: ")
      .newline(2)
      .write("bun run <command> [options]")
      .newline(0)
      .gray("Commands:")
      .newline(2)
      .write("help")
      .gray(" - Show instruction")
      .newline()
      .write("help <command>")
      .gray(" - Show help for a command");
    const commandTabLevel = textBuilder.tabLevel;
    for (const command of this.commands.values()) {
      textBuilder
        .newline(commandTabLevel)
        .with((builder) => command.shortHelpInGlobalHelp(builder));
    }
    return textBuilder.build();
  }
}
