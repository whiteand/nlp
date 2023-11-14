export function csvify<CS extends string, K extends CS>(
  value: Readonly<Record<K, string>>,
  { columns }: { columns: readonly CS[] }
) {
  const cells: string[] = [];
  for (const column of columns) {
    const v = value?.[column as K];
    if (!v) {
      cells.push("");
      continue;
    }
    if (v.includes(" ")) {
      if (v.includes('"')) {
        cells.push(`'${v}'`);
      }
      cells.push(`"${v}"`);
    }
    cells.push(v);
  }

  return cells.join(",");
}
