const SectionHeading = ({ title, description, align = "left", action, className = "" }) => (
  <div
    className={`mb-8 flex flex-col gap-4 md:mb-12 ${
      align === "center"
        ? "items-center text-center"
        : "md:flex-row md:items-end md:justify-between"
    } ${className}`}
  >
    <div className={align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}>
      <h2 className="h-section">{title}</h2>
      {description && <p className="mt-3 text-muted sm:text-lg">{description}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default SectionHeading;
