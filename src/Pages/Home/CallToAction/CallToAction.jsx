import { Link } from "react-router";
import useAuth from "../../../Hooks/useAuth";

const CallToAction = () => {
  const { user } = useAuth();

  return (
    <section className="section">
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-3xl bg-neutral px-6 py-12 text-neutral-content sm:px-12 md:py-16">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-brand/35 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 -left-16 -z-10 h-72 w-72 rounded-full bg-secondary/30 blur-3xl"
          />
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready for your next trip?
            </h2>
            <p className="mt-3 text-neutral-content/80 sm:text-lg">
              Find a trip that fits, or share what you know and host travelers as a
              local guide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/allTrips" className="btn btn-primary btn-lg">
                Browse trips
              </Link>
              <Link
                to={user ? "/dashboard/joinAsTourGuide" : "/register"}
                className="btn btn-glass btn-lg"
              >
                {user ? "Become a guide" : "Create a free account"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
