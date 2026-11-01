const PageHeader = ({ title, description, actions, className = "" }) => (
  <div
    className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}
  >
    <div className="min-w-0">
      <h1 className="h-page break-words">{title}</h1>
      {description && (
        <p className="mt-1.5 max-w-2xl text-sm text-muted sm:text-base">{description}</p>
      )}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
