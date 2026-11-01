import { Link } from "react-router";
import logoMark from "../../assets/logo-mark.png";

/** Brand mark + live-text wordmark, so the logo stays readable in both themes. */
const Logo = ({ to = "/", className = "", size = "md", tone = "auto", onClick }) => {
  const sizes = {
    sm: { mark: "h-8 w-8", text: "text-lg" },
    md: { mark: "h-9 w-9 sm:h-10 sm:w-10", text: "text-xl sm:text-[1.4rem]" },
    lg: { mark: "h-12 w-12", text: "text-3xl" },
  }[size];

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-label="TourNest home"
      className={`inline-flex items-center gap-2 rounded-lg ${className}`}
    >
      <img
        src={logoMark}
        alt=""
        width="40"
        height="40"
        className={`${sizes.mark} shrink-0 object-contain`}
      />
      <span
        className={`font-display font-extrabold leading-none tracking-tight ${sizes.text} ${
          tone === "light" ? "text-white" : ""
        }`}
      >
        Tour<span className={tone === "light" ? "text-brand" : "text-primary"}>Nest</span>
      </span>
    </Link>
  );
};

export default Logo;
