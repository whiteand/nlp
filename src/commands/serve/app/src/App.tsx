import { Router, RouterProvider } from "@tanstack/react-router";
import { SocketContext, WS } from "./packages/be/be";
import { contactsRoute } from "./pages/Contacts";
import { dictionaryRoute } from "./pages/Dictionary";
import { indexRoute } from "./pages/Index";
import { rootRoute } from "./rootRoute";
import { useMemo } from "react";

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  contactsRoute,
  dictionaryRoute,
]);

function createRouter(ws: WS) {
  const router = new Router({
    routeTree,
    context: {
      ws,
    },
  });

  return router;
}

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

function App({ socket }: { socket: WS }) {
  const router = useMemo(() => createRouter(socket), [socket]);
  return (
    <SocketContext.Provider value={socket}>
      <RouterProvider router={router} />
    </SocketContext.Provider>
  );
}

export default App;
