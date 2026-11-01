import { Link } from "react-router";
import { LuLock } from "react-icons/lu";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import Logo from "../../Components/Common/Logo";
import ThemeToggle from "../../Components/Common/ThemeToggle";

const Forbidden = ({ embedded = false }) => {
  useDocumentTitle("Access denied");

  const content = (
    <div className="flex flex-col items-center py-12 text-center">
      <span className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-error/10 text-error">
        <LuLock size={36} aria-hidden="true" />
      </span>
      <h1 className="h-page mt-6">You don't have access to this page</h1>
      <p className="mt-3 max-w-md text-muted">
        This area is limited to a different account type. If you think that's a mistake, contact an
        administrator.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/dashboard" className="btn btn-primary">
          Back to dashboard
        </Link>
        <Link to="/" className="btn btn-outline">
          Go to home
        </Link>
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container-page flex h-16 items-center justify-between">
        <Logo />
        <ThemeToggle />
      </header>
      <main id="main" className="container-page flex flex-1 items-center justify-center">
        {content}
      </main>
    </div>
  );
};

export default Forbidden;
