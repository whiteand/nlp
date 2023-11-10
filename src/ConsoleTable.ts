type CellRenderer<T, K extends keyof T> = (
  value: T[K],
  key: K,
  obj: T,
  index: number,
  rows: T[]
) => string;

function defaultRenderer<T, K extends keyof T>(value: T[K]): string {
  return `${value}`;
}

export class ConsoleTable<T extends object> {
  rows: T[] = [];
  cols: (keyof T)[] = [];
  renderers: Map<keyof T, CellRenderer<T, any>>;
  labels: Map<keyof T, string> = new Map();
  constructor() {
    this.rows = [];
    this.cols = [];
    this.renderers = new Map();
  }
  push(...objects: T[]): this {
    for (const obj of objects) {
      const keys = Object.keys(obj) as (keyof T)[];
      this.addCols(keys);
    }
    this.rows.push(...objects);
    return this;
  }
  private addCols(ks: (keyof T)[]) {
    for (const k of ks) {
      if (this.cols.includes(k)) continue;
      this.cols.push(k);
      if (!this.renderers.has(k)) {
        this.withColumnRenderer(k, defaultRenderer);
      }
      if (!this.labels.has(k)) {
        this.withLabel(k, String(k));
      }
    }
  }
  withColumnRenderer<K extends keyof T>(
    col: K,
    renderer: CellRenderer<T, K>
  ): this {
    this.renderers.set(col, renderer);
    return this;
  }
  withLabel<K extends keyof T>(col: K, label: string): this {
    if (!this.cols.includes(col)) {
      this.cols.push(col);
    }
    this.labels.set(col, label);
    return this;
  }
  *lines(): Generator<string> {
    const colsWidth = new Map<keyof T, number>();
    const cells: string[][] = [];
    const rowsN = this.rows.length;
    const colN = this.cols.length;
    for (let colInd = 0; colInd < colN; colInd++) {
      const col = this.cols[colInd];
      const columnValues: string[] = [];
      const label = this.labels.get(col) || String(col);
      let maxW = label.length;
      const renderer = this.renderers.get(col) || defaultRenderer;
      for (let rowInd = 0; rowInd < rowsN; rowInd++) {
        const r = this.rows[rowInd];
        const value = r[col];
        const renderedValue = renderer(value, col, r, rowInd, this.rows);
        columnValues.push(renderedValue);
        maxW = Math.max(maxW, renderedValue.length);
      }
      cells.push(columnValues);
      colsWidth.set(col, maxW);
    }

    let headerLine = "";
    let secondLine = "";
    for (const col of this.cols) {
      const colLabel = this.labels.get(col) || String(col);
      const colW = colsWidth.get(col) || 0;
      headerLine += "| " + colLabel.padEnd(colW, " ") + " ";
      secondLine += "|:" + "-".repeat(colW) + ":";
    }
    headerLine += "|";
    secondLine += "|";

    yield headerLine;
    yield secondLine;

    for (let rowInd = 0; rowInd < rowsN; rowInd++) {
      let line = "";
      for (let colInd = 0; colInd < colN; colInd++) {
        const cellText = cells[colInd][rowInd];
        const colW = colsWidth.get(this.cols[colInd]) || 0;
        line += "| " + cellText.padEnd(colW, " ") + " ";
      }
      line += "|";
      yield line;
    }
  }
  toString(): string {
    return [...this.lines()].join("\n");
  }
  print(): this {
    for (const line of this.lines()) {
      console.log(line);
    }
    return this;
  }
}
