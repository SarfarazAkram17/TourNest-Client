const Loading = ({ label = "Loading", className = "min-h-[50vh]" }) => {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="loading loading-ring loading-lg text-primary" aria-hidden="true"></span>
      <span className="text-sm text-muted">{label}...</span>
    </div>
  );
};

export default Loading;
