import { useEffect, useId, useRef } from "react";
import { LuX } from "react-icons/lu";

const SIZES = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

/**
 * Accessible modal built on the native <dialog> element:
 * focus is trapped, Escape closes it and the page behind is inert.
 */
const Modal = ({ open, onClose, title, description, size = "md", footer, children }) => {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby={title ? titleId : undefined}
      className="modal modal-bottom sm:modal-middle"
    >
      {open && (
        <div
          className={`modal-box w-full ${SIZES[size]} border border-base-content/10 bg-base-100 p-0`}
        >
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-base-content/10 bg-base-100 px-5 py-4">
            <div className="min-w-0">
              {title && (
                <h2 id={titleId} className="text-lg font-bold leading-snug">
                  {title}
                </h2>
              )}
              {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle -mr-2 shrink-0"
              aria-label="Close dialog"
            >
              <LuX size={20} />
            </button>
          </div>
          <div className="px-5 py-5">{children}</div>
          {footer && (
            <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-base-content/10 bg-base-100 px-5 py-4 sm:flex-row sm:justify-end">
              {footer}
            </div>
          )}
        </div>
      )}
      <form method="dialog" className="modal-backdrop">
        <button aria-label="Close dialog">close</button>
      </form>
    </dialog>
  );
};

export default Modal;
