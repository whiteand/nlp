import {
  Outlet,
  RootRoute,
  rootRouteWithContext,
} from "@tanstack/react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { WS } from "./packages/be/be";

// Create a root route
export const rootRoute = rootRouteWithContext<{
  ws: WS;
}>()({
  component: Root,
});

function Root() {
  return (
    <>
      <Header />
      <main className="mt-4 min-h-[calc(100svh_-_180px)] md:min-h-[calc(100vh_-_92px)] px-3">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
