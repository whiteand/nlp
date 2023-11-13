import { IHelpNode } from "./types";

export function getAllPaths(node: IHelpNode): string[][] {
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
