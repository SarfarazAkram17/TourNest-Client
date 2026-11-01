import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { LuMenu, LuX } from "react-icons/lu";
import useAuth from "../../Hooks/useAuth";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

export const publicLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/allTrips", label: "All trips" },
  { to: "/community", label: "Community" },
  { to: "/aboutUs", label: "About" },
];

const Navbar = () => {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-base-content/75 hover:bg-base-content/6 hover:text-base-content"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-base-content/10 bg-base-100/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-2 sm:h-[4.5rem]">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {!loading &&
            (user ? (
              <UserMenu />
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/login" className="btn btn-ghost">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign up
                </Link>
              </div>
            ))}
          <button
            type="button"
            className="btn btn-ghost btn-circle md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <LuX size={22} /> : <LuMenu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-base-content/10 bg-base-100 md:hidden"
          style={{ animation: "tn-pop 0.15s ease-out" }}
        >
          <nav aria-label="Mobile" className="container-page flex flex-col gap-1 py-4">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-base font-semibold ${
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-base-content/6"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!loading && !user && (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
                <Link to="/login" className="btn btn-outline">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
