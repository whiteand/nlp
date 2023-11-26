import { Observable, fromEventPattern, takeUntil } from "rxjs";

export function takeUntilAborted(
  signal: AbortController["signal"]
): <T>(value: Observable<T>) => Observable<T> {
  return (source) =>
    source.pipe(
      takeUntil(
        fromEventPattern(
          (handler) => signal.addEventListener("abort", handler),
          (handler) => signal.removeEventListener("abort", handler)
        )
      )
    );
}
