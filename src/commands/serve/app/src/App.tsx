import React from "react";
import { RouterProvider, Router } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";
import { indexRoute } from "./indexRoute";
import { contactsRoute } from "./contactsRoute";

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([indexRoute, contactsRoute]);

// Create the router using your route tree
const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
