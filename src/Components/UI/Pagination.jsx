import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const buildPages = (page, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("gap-" + p);
    result.push(p);
  });
  return result;
};

const Pagination = ({ page, totalPages, onChange, className = "" }) => {
  if (!totalPages || totalPages <= 1) return null;

  const go = (next) => {
    if (next < 1 || next > totalPages || next === page) return;
    onChange(next);
  };

  return (
    <nav
      aria-label="Pagination"
      className={`mt-8 flex items-center justify-center gap-2 ${className}`}
    >
      <button
        type="button"
        className="btn btn-sm btn-square btn-outline"
        onClick={() => go(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <LuChevronLeft size={18} />
      </button>

      <span className="px-2 text-sm font-medium sm:hidden" aria-live="polite">
        Page {page} of {totalPages}
      </span>

      <div className="hidden items-center gap-1.5 sm:flex">
        {buildPages(page, totalPages).map((p) =>
          typeof p === "string" ? (
            <span key={p} className="px-1 text-muted" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
              className={`btn btn-sm btn-square ${
                p === page ? "btn-primary" : "btn-ghost"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        className="btn btn-sm btn-square btn-outline"
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <LuChevronRight size={18} />
      </button>
    </nav>
  );
};

export default Pagination;
