import { Outlet, RootRoute } from "@tanstack/react-router";
import Header from "./components/Header";

// Create a root route
export const rootRoute = new RootRoute({
  component: Root,
});
function Root() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
