import React from "react";
import { Route } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Index,
});
function Index() {
  return (
    <div>
      <h3>Welcome Home!</h3>
    </div>
  );
}
