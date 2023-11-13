import { relative } from "path";

export function formatCommand(...args: string[]): string {
  const actualArgv = Bun.argv;
  const res = [];
  res.push("bun");
  res.push(relative(process.cwd(), actualArgv.at(1) || ""));
  res.push(
    ...args.map((elem) => {
      if (!elem.includes(" ")) {
        return elem;
      }
      if (elem.includes('"')) {
        return `'${elem}'`;
      }
      return `"${elem}"`;
    })
  );
  return res.join(" ");
}
