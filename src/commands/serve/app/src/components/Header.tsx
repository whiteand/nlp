import { Link } from "@tanstack/react-router";

const LINKS = [
  {
    href: "/",
    text: "Home",
  },
  {
    href: "/contacts",
    text: "Contacts",
  },
] as const;

function Header() {
  return (
    <header className="container flex gap-1 mx-auto">
      {LINKS.map((link) => (
        <Link to={link.href} key={link.href}>
          {link.text}
        </Link>
      ))}
    </header>
  );
}

export default Header;
