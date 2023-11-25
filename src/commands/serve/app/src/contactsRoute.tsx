import React from "react";
import { Route } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";

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
        Мене звати Андрій. Можете звернутись до мене написавши на мій email:
      </p>
      <a
        href="mailto:andrewbeletskiy@gmail.com"
        className="py-3 px-5 flex items-center justify-center font-mono bg-gray-100"
      >
        andrewbeletskiy@gmail.com
      </a>
    </article>
  );
}
