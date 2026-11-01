import { Link } from "react-router";
import { LuBadgeCheck, LuBanknote, LuBookHeart, LuShieldCheck } from "react-icons/lu";
import heroImage from "../../../assets/hero-3.jpg";

const reasons = [
  {
    icon: LuBadgeCheck,
    title: "Guides reviewed by people",
    text: "Applicants submit a CV, experience and languages. An admin approves each guide before they can host.",
  },
  {
    icon: LuShieldCheck,
    title: "Secure payments",
    text: "Cards are processed by Stripe, and TourNest never sees or stores your card details.",
  },
  {
    icon: LuBanknote,
    title: "Automatic refunds",
    text: "If your guide declines or you cancel before confirmation, your payment is returned to your card.",
  },
  {
    icon: LuBookHeart,
    title: "Honest stories",
    text: "Read what travelers and guides actually experienced before you choose where to go.",
  },
];

const WhyChooseUs = () => (
  <section className="section bg-base-200">
    <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="relative">
        <img
          src={heroImage}
          alt="Travelers exploring a scenic spot in Bangladesh"
          loading="lazy"
          className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
        />
      </div>

      <div>
        <h2 className="h-section">Travel with confidence</h2>
        <p className="mt-3 text-muted sm:text-lg">
          Booking a trip should never feel like a gamble. Here is how we keep it
          clear for travelers and fair for guides.
        </p>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {reasons.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/12 text-secondary">
                <Icon size={22} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="font-bold leading-snug">{title}</h3>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
        <Link to="/aboutUs" className="btn btn-outline mt-8">
          How TourNest works
        </Link>
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
