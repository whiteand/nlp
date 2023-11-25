import { Route } from "@tanstack/react-router";
import { rootRoute } from "../rootRoute";
import Logo from "../components/Logo";

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Index,
});
function Index() {
  return (
    <div className="container mx-auto">
      <h1 className="flex items-center gap-4">
        <Logo width="40" height="40" />
        Зрозуміло
      </h1>
      <p>
        Я мрію про те, щоб українська мова була доступною для всіх. Щоб кожен,
        не зважаючи на свій рівень знань - міг писати грамотно із використанням
        моєї программи.
      </p>
      <p>
        Цей сайт я хочу використати для створення цього механізму і для
        візуалізації результатів цієї роботи.
      </p>
    </div>
  );
}
