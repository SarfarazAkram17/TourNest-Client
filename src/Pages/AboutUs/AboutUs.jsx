import { Link } from "react-router";
import { FaGithub } from "react-icons/fa";
import { LuExternalLink, LuMap, LuShieldCheck, LuUserRound } from "react-icons/lu";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import SectionHeading from "../../Components/UI/SectionHeading";

const roles = [
  {
    icon: LuMap,
    title: "For travelers",
    points: [
      "Browse trips and compare local guides",
      "Reserve, pay by card and track every status",
      "Cancel before confirmation for a full refund",
      "Share photo stories with the community",
    ],
  },
  {
    icon: LuUserRound,
    title: "For tour guides",
    points: [
      "Apply once, get reviewed by an admin",
      "Accept or decline booking requests",
      "See upcoming tours and earnings at a glance",
      "Build a public profile with your stories",
    ],
  },
  {
    icon: LuShieldCheck,
    title: "For admins",
    points: [
      "Review guide applications with full details",
      "Publish and manage tour packages",
      "Monitor users, bookings and revenue",
      "Keep the platform trustworthy",
    ],
  },
];

const stack = [
  "React 19",
  "Tailwind CSS 4",
  "DaisyUI 5",
  "React Router 7",
  "TanStack Query",
  "Firebase Auth",
  "Express 5",
  "MongoDB",
  "Stripe",
  "Recharts",
];

const projects = [
  {
    name: "Studify",
    text: "A group study platform where students create assignments, submit work and peer-review with scores and feedback.",
    live: "https://studify-sarfaraz-akram.netlify.app",
    code: "https://github.com/SarfarazAkram17/Studify-Client",
    logo: "https://i.ibb.co/XZt0GXVB/s-removebg-preview.png",
  },
  {
    name: "TaskWave",
    text: "A freelance marketplace for small tasks where employers post work and freelancers bid for it.",
    live: "https://taskwave-sarfaraz-akram.netlify.app",
    code: "https://github.com/SarfarazAkram17/Taskwave-Client",
    logo: "https://i.ibb.co/XfF7mp1S/logo.png",
  },
];

const AboutUs = () => {
  useDocumentTitle("About");

  return (
    <>
      <section className="border-b border-base-content/10 bg-base-200">
        <div className="container-page py-12 md:py-20">
          <h1 className="h-display max-w-4xl">Travel that supports the people who live there</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            TourNest connects travelers with verified local guides across Bangladesh. We handle the
            booking, payment and communication, so everyone can focus on the trip.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/allTrips" className="btn btn-primary">
              Browse trips
            </Link>
            <Link to="/dashboard/joinAsTourGuide" className="btn btn-outline">
              Become a guide
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeading
            title="One platform, three roles"
            description="Every account gets a dashboard built around what that person needs to do."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {roles.map(({ icon: Icon, title, points }) => (
              <article key={title} className="surface p-6">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-muted">
                  {points.map((p) => (
                    <li key={p} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-base-200">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="h-section">Built with a modern stack</h2>
            <p className="mt-3 text-muted sm:text-lg">
              A React single-page app talks to a secured Express API. Payments run through Stripe
              and sign-in through Firebase.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {stack.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-base-content/15 bg-base-100 px-3.5 py-1.5 text-sm font-medium"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="surface p-6 sm:p-8">
            <h2 className="text-2xl font-bold">About the developer</h2>
            <p className="mt-3 text-muted">
              Hi, I'm <strong className="text-base-content">Sarfaraz Akram</strong>, a full-stack web
              developer from Bangladesh. I build responsive, accessible products with React, Tailwind
              CSS, Firebase, MongoDB and Express.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="https://sarfarazakram.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Portfolio <LuExternalLink size={14} aria-hidden="true" />
              </a>
              <a
                href="https://github.com/SarfarazAkram17"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                <FaGithub size={14} aria-hidden="true" /> GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeading title="More projects" description="Other things I've built." />
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((p) => (
              <article key={p.name} className="surface flex flex-col p-6">
                <div className="flex items-center gap-3">
                  <img src={p.logo} alt="" className="h-11 w-11 object-contain" loading="lazy" />
                  <h3 className="text-xl font-bold">{p.name}</h3>
                </div>
                <p className="mt-4 text-muted">{p.text}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    Live demo <LuExternalLink size={14} aria-hidden="true" />
                  </a>
                  <a
                    href={p.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                    aria-label={`${p.name} source code on GitHub`}
                  >
                    <FaGithub size={16} /> Source
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
