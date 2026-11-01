import { Link } from "react-router";

/** Titled surface used for lists and side panels on dashboards. */
const Panel = ({ title, subtitle, actionLabel, actionTo, children, className = "" }) => (
  <section className={`surface min-w-0 p-4 sm:p-5 ${className}`}>
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-base font-bold leading-tight">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-muted sm:text-sm">{subtitle}</p>}
      </div>
      {actionTo && (
        <Link to={actionTo} className="btn btn-ghost btn-sm shrink-0 text-primary">
          {actionLabel}
        </Link>
      )}
    </div>
    {children}
  </section>
);

export default Panel;
