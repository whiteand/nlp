interface ILogger {
  log(...messages: string[]): void;
  incLevel(dl: number): void;
  resetLevel(): void;
  withLevel(dl: number, cb: () => void): ILogger;
}

export function createLogger(initialLevel = 0): ILogger {
  let level = initialLevel;
  return {
    log(...messages: string[]) {
      const fullMessage = messages.join(" ");
      const lines = fullMessage.split("\n");
      const indentedLines = lines.map((line) => " ".repeat(level) + line);
      console.log(indentedLines.join("\n"));
    },
    incLevel(dl: number) {
      level += dl;
    },
    resetLevel() {
      level = initialLevel;
    },
    withLevel(dl: number, fn: () => void): ILogger {
      const currentLevel = level;
      level += dl;
      try {
        fn();
      } finally {
        level = currentLevel;
      }
      level = currentLevel;
      return this;
    },
  };
}
