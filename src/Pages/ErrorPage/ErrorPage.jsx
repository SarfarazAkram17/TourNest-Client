import { Link, useNavigate } from "react-router";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import Logo from "../../Components/Common/Logo";
import ThemeToggle from "../../Components/Common/ThemeToggle";

const ErrorPage = () => {
  useDocumentTitle("Page not found");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container-page flex h-16 items-center justify-between">
        <Logo />
        <ThemeToggle />
      </header>
      <main id="main" className="container-page flex flex-1 flex-col items-center justify-center py-12 text-center">
        <p
          aria-hidden="true"
          className="bg-linear-to-br from-primary to-secondary bg-clip-text font-display text-[clamp(6rem,28vw,12rem)] font-extrabold leading-none tracking-tighter text-transparent"
        >
          404
        </p>
        <h1 className="h-page mt-2">This trail doesn't lead anywhere</h1>
        <p className="mt-3 max-w-md text-muted">
          The page you're looking for was moved or never existed. Head back and pick another route.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn btn-primary">
            Go to home
          </Link>
          <Link to="/allTrips" className="btn btn-outline">
            Browse trips
          </Link>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </main>
    </div>
  );
};

export default ErrorPage;
