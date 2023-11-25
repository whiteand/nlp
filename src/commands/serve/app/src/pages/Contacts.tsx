import React from "react";
import { Route } from "@tanstack/react-router";
import { rootRoute } from "../rootRoute";

export const contactsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/contacts",
  component: Contacts,
});
function Contacts() {
  return (
    <article className="container mx-auto">
      <h1>Контакти</h1>
      <p>
        Звертайтесь до мене через Github:{" "}
        <a
          href="https://github.com/whiteand/nlp"
          className="text-bold test-sky-900 inline-block font-bold font-mono"
        >
          @whiteand
        </a>
      </p>
    </article>
  );
}
