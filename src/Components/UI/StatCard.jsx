import { Link } from "react-router";

const TONES = {
  primary: "bg-primary/12 text-primary",
  secondary: "bg-secondary/12 text-secondary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning",
  info: "bg-info/12 text-info",
  error: "bg-error/12 text-error",
  neutral: "bg-base-content/8 text-base-content/70",
};

const StatCard = ({ icon: Icon, label, value, hint, tone = "primary", to }) => {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        {Icon && (
          <span
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}
          >
            <Icon size={20} aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="mt-3 break-words font-display text-2xl font-bold tracking-tight tabular-nums sm:text-[1.75rem]">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </>
  );

  const classes = "surface block min-w-0 p-4 sm:p-5";
  return to ? (
    <Link to={to} className={`${classes} transition-colors hover:border-primary/40`}>
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  );
};

export default StatCard;
