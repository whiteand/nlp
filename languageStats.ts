export function languageStats(
  fileContent: Record<string, { message: string; time: string }>
): void {
  const messages = Object.entries(fileContent).map(
    ([id, { message, time }]) => ({
      id,
      message,
      time,
    })
  );
  console.log(messages);
}
