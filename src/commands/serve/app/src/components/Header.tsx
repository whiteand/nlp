import { Link, useMatch } from "@tanstack/react-router";
import clsx from "../packages/clsx";
import Logo from "./Logo";

const LINKS = [
  {
    href: "/",
    text: "Головна",
  },
  {
    href: "/contacts",
    text: "Контакти",
  },
] as const;

function Header({ className }: { className?: string }) {
  return (
    <header
      className={clsx(
        "bg-sky-900/10 flex justify-center items-center py-2",
        className
      )}
    >
      <div className="container mx-auto flex gap-8 items-center justify-start">
        <div className="flex items-center gap-2 rounded-full bg-white pl-1 pr-4 py-1">
          <Logo className="text-white relative" width="28" height="28" />
          <div className="text-sky-900 uppercase text-base">Зрозуміло</div>
        </div>
        <nav className="flex gap-4">
          {LINKS.map((link) => (
            <Link
              to={link.href}
              className="text-lg font-bold uppercase rounded-lg text-red"
              activeProps={{
                className: "text-sky-900",
              }}
              key={link.href}
            >
              {link.text}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
