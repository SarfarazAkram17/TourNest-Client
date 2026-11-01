const FormField = ({ label, htmlFor, error, hint, required, className = "", children }) => (
  <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
    {label && (
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
        {required && (
          <span className="text-error" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
    )}
    {children}
    {hint && !error && <p className="text-xs text-muted">{hint}</p>}
    {error && (
      <p role="alert" className="text-xs font-medium text-error">
        {error}
      </p>
    )}
  </div>
);

export default FormField;
