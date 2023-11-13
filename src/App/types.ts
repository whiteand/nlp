import { TextBuilder } from "../TextBuilder";

export interface IHelpNode {
  message: string[];
  children?: Record<string, IHelpNode>;
}

export interface ICommand {
  name: string;
  run(args: string[]): Promise<void>;
  shortHelpInGlobalHelp(textBuilder: TextBuilder): void;
  help(): IHelpNode;
}
