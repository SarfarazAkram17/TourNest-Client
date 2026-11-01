import { LuBadgeCheck, LuCreditCard, LuMapPinned } from "react-icons/lu";
import Logo from "../../Components/Common/Logo";
import ThemeToggle from "../../Components/Common/ThemeToggle";
import heroImage from "../../assets/hero-2.jpg";

const perks = [
  { icon: LuMapPinned, text: "Curated trips across every division" },
  { icon: LuBadgeCheck, text: "Verified local guides you can choose" },
  { icon: LuCreditCard, text: "Secure card payments with Stripe" },
];

/** Shared split-screen frame for the login and register pages. */
const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="grid min-h-screen bg-base-100 lg:grid-cols-[1.05fr_1fr]">
    <aside className="relative hidden overflow-hidden lg:block" aria-hidden="true">
      <img src={heroImage} alt="" className="hero-img absolute inset-0 h-full w-full object-cover" />
      <div className="hero-scrim absolute inset-0" />
      <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white xl:p-14">
        <Logo tone="light" />
        <div className="max-w-md">
          <p className="font-display text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            Your next journey starts with a local who knows the way.
          </p>
          <ul className="mt-8 space-y-4">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/90">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                  <Icon size={18} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>

    <div className="flex min-w-0 flex-col">
      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="lg:invisible">
          <Logo />
        </div>
        <ThemeToggle />
      </div>

      <main id="main" className="flex flex-1 items-center justify-center px-4 pb-10 pt-2 sm:px-8">
        <div className="w-full max-w-md">
          <h1 className="h-page">{title}</h1>
          <p className="mt-1.5 text-muted">{subtitle}</p>
          <div className="mt-7">{children}</div>
          {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
        </div>
      </main>
    </div>
  </div>
);

export default AuthShell;
