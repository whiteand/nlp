import { Outlet, RootRoute } from "@tanstack/react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Create a root route
export const rootRoute = new RootRoute({
  component: Root,
});
function Root() {
  return (
    <>
      <Header />
      <main className="mt-4 min-h-[calc(100vh_-_76px)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
