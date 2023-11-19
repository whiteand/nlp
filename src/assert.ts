import { TextBuilder } from "./TextBuilder";

export function throwSmart(cb: (tb: TextBuilder) => void): never {
  const tb = new TextBuilder({
    width: 80,
  });
  cb(tb);
  const message = tb.build().join("\n");
  throw new Error(message);
}

export function assert<T>(
  condition: T,
  cb: (tb: TextBuilder) => void
): asserts condition {
  if (!condition) {
    throwSmart(cb);
  }
}
