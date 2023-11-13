import { reset } from "colors/safe";

type Values<T> = T[keyof T];
type NumericFields<T> = Values<{
  [K in keyof T]: T[K] extends number | null | undefined ? K : never;
}>;

const DEFAULT_THEME: Omit<ITheme<any, any>, "labelProp"> = {
  label: (value) => value,
  bar: (value) => value,
  value: (value) => value.toString(),
  width: 80,
  header({ labelWidth, valueWidth, barWidth, labelProp, valueProp }) {
    const labelTitle = labelProp.toString().padEnd(labelWidth, " ");
    const barTitle = " ".repeat(barWidth);
    const valueTitle = valueProp.toString().padEnd(valueWidth, " ");
    return [`| ${labelTitle} | ${barTitle} | ${valueTitle} `];
  },
};

function getSmallerPairIndexes<T extends { value: number }>(
  rows: T[]
): [number, number] {
  let smallest = 0;
  let smaller = 1;
  if (rows[0].value > rows[1].value) {
    smallest = 1;
    smaller = 0;
  }
  let smallestValue = rows[smallest].value;
  let smallerValue = rows[smaller].value;
  for (let i = 2, n = rows.length; i < n; i++) {
    const value = rows[i].value;
    if (value < smallestValue) {
      smaller = smallest;
      smallerValue = smallestValue;
      smallest = i;
      smallestValue = value;
      continue;
    }
    if (value < smallerValue) {
      smaller = i;
      smallerValue = value;
      continue;
    }
  }
  return [smallest, smaller];
}

function collapseSmallest(
  rows: { value: number; label: string }[],
  totalValue: number,
  collapseSmall: { label: string; minRatio: number }
): { value: number; label: string }[] {
  const removed = new Set<number>();
  const collected = { label: collapseSmall.label, value: 0 };
  const minTotal = totalValue * collapseSmall.minRatio;
  while (true) {
    if (removed.size === rows.length - 1) break;

    let minIndex = 0;
    while (removed.has(minIndex) && minIndex < rows.length) {
      minIndex++;
    }

    if (minIndex >= rows.length) break;

    for (let i = minIndex + 1, n = rows.length; i < n; i++) {
      if (removed.has(i)) continue;
      if (rows[i].value >= rows[minIndex].value) continue;
      minIndex = i;
    }

    const minValue = rows[minIndex].value;

    if (collected.value + minValue > minTotal) break;

    collected.value += minValue;
    removed.add(minIndex);
  }
  const res: { label: string; value: number }[] = [];
  for (let i = 0, n = rows.length; i < n; i++) {
    if (removed.has(i)) continue;
    res.push(rows[i]);
  }
  if (removed.size > 0) {
    res.push(collected);
  }
  return res;
}

interface ISizes {
  labelWidth: number;
  valueWidth: number;
  barWidth: number;
  labelProp: string;
  valueProp: string;
}

export interface ITheme<T, L extends keyof T> {
  width: number;
  labelProp: L;
  label: (value: T[L]) => string;
  bar: (value: string) => string;
  value: (value: number) => string;
  header: (sizes: ISizes) => string[];
}

export interface IPartialTheme<T, L extends keyof T> {
  width?: number;
  labelProp: L;
  label?: (value: T[L]) => string;
  bar?: (value: string) => string;
  value?: (value: number) => string;
  header?: (sizes: {
    labelWidth: number;
    valueWidth: number;
    barWidth: number;
  }) => string[];
  collapseSmall?: {
    label: string;
    minRatio: number;
  };
}

export class ConsoleBarChart<T extends object> {
  private rows: T[];
  private valueProp: string | number | symbol;
  constructor({ rows, valueProp }: { rows: T[]; valueProp: NumericFields<T> }) {
    this.rows = rows;
    this.valueProp = valueProp;
  }
  push(...rows: T[]): this {
    this.rows.push(...rows);
    return this;
  }
  getValue(value: T): number {
    return (value as any)[this.valueProp] || 0;
  }
  sort(cmp: (first: T, second: T) => number): this {
    this.rows.sort(cmp);
    return this;
  }
  private groupRows<K extends keyof T>({
    labelProp,
    collapseSmall,
  }: Pick<IPartialTheme<T, K>, "labelProp" | "collapseSmall">): {
    rows: { label: string; value: number }[];
    minValue: number;
    maxValue: number;
  } {
    const labels: string[] = [];
    const valueByLabel = new Map<string, number>();
    let maxValue = -Infinity;
    let minValue = Infinity;
    let totalValue = 0;
    for (const row of this.rows) {
      const label = `${row[labelProp]}`;
      if (!valueByLabel.has(label)) {
        valueByLabel.set(label, 0);
        labels.push(label);
      }
      const rowValue = this.getValue(row);
      const newValue = valueByLabel.get(label)! + rowValue;
      if (newValue > maxValue) {
        maxValue = newValue;
      }
      if (newValue < minValue) {
        minValue = newValue;
      }
      totalValue += rowValue;
      valueByLabel.set(label, newValue);
    }
    let rows: { label: string; value: number }[] = labels.map((label) => ({
      label,
      value: valueByLabel.get(label) ?? 0,
    }));

    rows = collapseSmall
      ? collapseSmallest(rows, totalValue, collapseSmall)
      : rows;
    return { rows: rows, maxValue, minValue };
  }

  *iterLines<K extends keyof T>(theme: IPartialTheme<T, K>): Generator<string> {
    const width = theme.width ?? DEFAULT_THEME.width;
    const labelProp = theme.labelProp;
    const renderBar = theme.bar ?? DEFAULT_THEME.bar;
    const renderLabel = theme.label ?? DEFAULT_THEME.label;
    const renderValue = theme.value ?? DEFAULT_THEME.value;
    const renderHeader = theme.header ?? (() => []);
    const groupedRows = this.groupRows({
      labelProp,
      collapseSmall: theme.collapseSmall,
    });
    const cells: { label: string; value: string; bar: string }[] = [];
    const sizes: ISizes = {
      barWidth: 0,
      labelProp: String(labelProp),
      labelWidth: 0,
      valueProp: String(this.valueProp),
      valueWidth: 0,
    };
    for (let i = 0, n = groupedRows.rows.length; i < n; i++) {
      const { label, value } = groupedRows.rows[i];
      const renderedLabel = renderLabel(label as T[K]);
      const renderedValue = renderValue(value);
      cells.push({
        label: renderedLabel,
        value: renderedValue,
        bar: "",
      });
      if (renderedLabel.length > sizes.labelWidth) {
        sizes.labelWidth = renderedLabel.length;
      }
      if (renderedValue.length > sizes.valueWidth) {
        sizes.valueWidth = renderedValue.length;
      }
    }
    const barWidth = width - sizes.labelWidth - sizes.valueWidth - 7;
    const rangeSize = groupedRows.maxValue - groupedRows.minValue;
    for (let i = 0, n = groupedRows.rows.length; i < n; i++) {
      const value = groupedRows.rows[i].value;
      const ratio = (value - groupedRows.minValue) / rangeSize;
      const bar = renderBar(
        "█".repeat(Math.round(ratio * barWidth)).padEnd(barWidth, ".")
      );
      const renderedBar = renderBar(bar);
      cells[i].bar = renderedBar;
      cells[i].label = cells[i].label.padEnd(sizes.labelWidth, " ");
      cells[i].value = cells[i].value.padStart(sizes.valueWidth, " ");
    }
    const headerLines = renderHeader(sizes);
    for (const line of headerLines) {
      yield line;
    }
    for (const cell of cells) {
      yield `| ${cell.label} | ${cell.value} | ${cell.bar}`;
    }
  }
  toString<K extends keyof T>(theme: IPartialTheme<T, K>): string {
    return [...this.iterLines(theme)].join("\n");
  }
}
