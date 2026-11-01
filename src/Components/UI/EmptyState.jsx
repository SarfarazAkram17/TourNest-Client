const EmptyState = ({ icon: Icon, title, description, children, className = "" }) => (
  <div
    className={`surface-flat flex flex-col items-center justify-center px-6 py-14 text-center ${className}`}
  >
    {Icon && (
      <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon size={26} aria-hidden="true" />
      </span>
    )}
    <h3 className="text-lg font-bold">{title}</h3>
    {description && <p className="mt-1.5 max-w-md text-sm text-muted">{description}</p>}
    {children && <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>}
  </div>
);

export default EmptyState;
