import { Route, useMatch } from "@tanstack/react-router";
import { firstValueFrom } from "rxjs";
import { uniqid } from "../packages/be/be";
import { rootRoute } from "../rootRoute";
import { Fragment } from "react";

let words: Array<{ text: string; base: string; id: string }> = [];

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
    const take = Number.isNaN(takeNumber) ? 20 : takeNumber;

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
  return (
    <article className="container mx-auto">
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
    </article>
  );
}
