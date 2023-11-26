import { Link, Route, useMatch, useSearch } from "@tanstack/react-router";
import { firstValueFrom } from "rxjs";
import { uniqid } from "../packages/be/be";
import { rootRoute } from "../rootRoute";
import { Fragment } from "react";

let words: Array<{ text: string; base: string; id: string }> = [];

const DEFAULT_TAKE = 20;

export const dictionaryRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/dictionary",
  validateSearch(rawParams): { skip: number; take: number } {
    const skipStr = rawParams.skip;
    const skipNumber =
      typeof skipStr === "string" ? Number.parseInt(skipStr, 10) : NaN;
    const skip = Number.isNaN(skipNumber) ? 0 : skipNumber;
    const takeStr = rawParams.take;
    const takeNumber =
      typeof takeStr === "string" ? Number.parseInt(takeStr, 10) : NaN;
    const take = Number.isNaN(takeNumber) ? DEFAULT_TAKE : takeNumber;

    return {
      skip,
      take,
    };
  },
  async load({ search, context: { ws } }) {
    const id = uniqid();
    const message$ = ws.multiplex(
      () => ({
        type: "get",
        resource: "dictionary",
        id,
        params: { skip: search.skip, take: search.take },
      }),
      () => ({
        type: "cancel",
        id: id,
      }),
      (message) =>
        message.type === "dictionary-response" && message.requestId === id
    );
    const value = await firstValueFrom(message$);
    if (value.type === "dictionary-response") {
      words = value.words;
    }
  },
  pendingComponent: () => <div>Завантаження словника...</div>,
  component: Dictionary,
});
function Dictionary() {
  const search = useSearch({
    strict: true,
    from: "/dictionary",
  });
  const skip = "skip" in search ? search.skip : 0;
  const take = "take" in search ? search.take : 20;
  return (
    <article className="container mx-auto pb-4">
      <h1>Словник</h1>
      <div className="grid grid-cols-2 w-fit">
        <div>Форма</div>
        <div>База</div>
        {words.map((word) => (
          <Fragment key={word.id}>
            <div>{word.text}</div>
            <div>{word.base}</div>
          </Fragment>
        ))}
      </div>
      <nav className="flex justify-start items-center gap-2 mt-2">
        {skip > 0 ? (
          <Link
            className="px-2 py-1 flex items-center justify-center bg-sky-900/10 hover:bg-sky-900/20"
            to="/dictionary"
            search={{ skip: Math.max(0, skip - take), take: take }}
          >
            &lt;
          </Link>
        ) : (
          <div className="px-2 py-1 flex items-center justify-center bg-sky-900/5">
            &lt;
          </div>
        )}
        {words.length > 0 ? (
          <Link
            className="px-2 py-1 flex items-center justify-center bg-sky-900/10 hover:bg-sky-900/20"
            to="/dictionary"
            search={{ skip: skip + take, take: take }}
          >
            &gt;
          </Link>
        ) : (
          <div className="px-2 py-1 flex items-center justify-center bg-sky-900/5">
            &gt;
          </div>
        )}
      </nav>
    </article>
  );
}
