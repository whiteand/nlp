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
    return this.sortDescending();
  }
  getValue(value: T): number {
    return (value as any)[this.valueProp] || 0;
  }
  private sortDescending(): this {
    this.rows.sort((a, b) => this.getValue(b) - this.getValue(a));
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
    const rows: { label: string; value: number }[] = labels.map((label) => ({
      label,
      value: valueByLabel.get(label) ?? 0,
    }));
    rows.sort((a, b) => b.value - a.value);
    if (collapseSmall) {
      while (true) {
        const smallest = rows.pop();
        if (!smallest) {
          break;
        }
        const smallest2 = rows.pop();
        if (!smallest2) {
          rows.push(smallest);
          break;
        }
        if (
          (smallest.value + smallest2.value) / totalValue >
          collapseSmall.minRatio
        ) {
          rows.push(smallest2, smallest);
          break;
        }
        rows.push({
          label: collapseSmall.label,
          value: smallest.value + smallest2.value,
        });
      }
    }
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
