export interface ILogger {
  log(...messages: string[]): void;
}

export function createLogger(): ILogger {
  return {
    log(...messages: string[]) {
      const fullMessage = messages.join(" ");
      console.log(fullMessage);
    },
  };
}
