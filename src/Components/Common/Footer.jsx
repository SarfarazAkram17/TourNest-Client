import { Link } from "react-router";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Logo from "./Logo";

const columns = [
  {
    title: "Explore",
    links: [
      { to: "/allTrips", label: "All trips" },
      { to: "/community", label: "Traveler stories" },
      { to: "/#guides", label: "Local guides" },
      { to: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Your account",
    links: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/dashboard/joinAsTourGuide", label: "Become a guide" },
      { to: "/dashboard/addStories", label: "Share a story" },
    ],
  },
  {
    title: "TourNest",
    links: [
      { to: "/aboutUs", label: "About" },
      { to: "/login", label: "Log in" },
      { to: "/register", label: "Create account" },
    ],
  },
];

const linkClass =
  "text-sm text-neutral-content/75 underline-offset-4 transition-colors hover:text-white hover:underline";

const Footer = ({ compact = false }) => {
  const year = new Date().getFullYear();

  if (compact) {
    return (
      <footer className="border-t border-base-content/10 py-5 text-center text-xs text-muted">
        © {year} TourNest. Built for travelers and guides across Bangladesh.
      </footer>
    );
  }

  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-[1.4fr_2fr]">
        <div className="max-w-sm">
          <Logo tone="light" />
          <p className="mt-4 text-sm leading-relaxed text-neutral-content/75">
            Curated trips, verified local guides and secure booking, so exploring
            Bangladesh feels effortless.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <a
              href="https://github.com/SarfarazAkram17"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile of the developer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
            >
              <FaGithub size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/sarfarazakram"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile of the developer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
            >
              <FaLinkedin size={18} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-display text-base font-bold text-white">{col.title}</h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-neutral-content/70 sm:flex-row">
          <p>© {year} TourNest. All rights reserved.</p>
          <p>Designed and developed by Sarfaraz Akram</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
