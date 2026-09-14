import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navLinks = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "DJs",
    path: "/djs",
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-orange-900/20 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">

        {/* LOGO */}
        <Link
          to="/"
          onClick={closeMenu}
          className="relative z-10 text-sm font-black tracking-[0.2em] text-white transition hover:text-orange-500"
        >
          PUBLIC SECRET
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-xs font-bold uppercase tracking-[0.2em] transition ${
                  isActive
                    ? "text-orange-500"
                    : "text-white/40 hover:text-orange-500"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <Link
            to="/tickets"
            className="btn btn-sm rounded-none border-0 bg-orange-700 px-5 font-bold text-white hover:bg-orange-600"
          >
            BUY TICKETS
          </Link>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="relative z-10 flex h-10 w-10 items-center justify-center md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <div className="flex w-6 flex-col gap-1.5">
            <span
              className={`block h-px w-full bg-white transition-transform duration-300 ${
                menuOpen ? "translate-y-[4px] rotate-45 bg-orange-500" : ""
              }`}
            />

            <span
              className={`block h-px w-full bg-white transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />

            <span
              className={`block h-px w-full bg-white transition-transform duration-300 ${
                menuOpen
                  ? "-translate-y-[4px] -rotate-45 bg-orange-500"
                  : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`absolute left-0 right-0 top-full border-b border-orange-900/20 bg-black transition-all duration-300 md:hidden ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-6 pb-8 pt-4">

          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `border-b border-white/10 py-5 text-sm font-bold uppercase tracking-[0.25em] transition ${
                  isActive
                    ? "text-orange-500"
                    : "text-white/40 hover:text-orange-500"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <Link
            to="/tickets"
            onClick={closeMenu}
            className="btn mt-6 h-14 rounded-none border-0 bg-orange-700 text-white hover:bg-orange-600"
          >
            BUY TICKETS ↗
          </Link>
        </nav>
      </div>
    </header>
  );
}