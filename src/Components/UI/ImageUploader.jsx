import { useId, useRef, useState } from "react";
import { toast } from "react-toastify";
import { LuImagePlus, LuX } from "react-icons/lu";
import { uploadImage } from "../../utils/cloudinary";

const ImageUploader = ({
  value = [],
  onChange,
  max = 10,
  label = "Images",
  helper,
  disabled = false,
}) => {
  const inputId = useId();
  const inputRef = useRef(null);
  const [pending, setPending] = useState(0);

  const remaining = max - value.length;
  const busy = pending > 0;

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (inputRef.current) inputRef.current.value = "";
    if (!files.length) return;

    if (files.length > remaining) {
      toast.error(
        remaining > 0
          ? `You can add ${remaining} more image${remaining === 1 ? "" : "s"}.`
          : `You can upload up to ${max} images.`
      );
      return;
    }

    setPending(files.length);
    const urls = [];
    for (const file of files) {
      try {
        urls.push(await uploadImage(file));
      } catch (error) {
        toast.error(error.message || "Image upload failed.");
      } finally {
        setPending((n) => n - 1);
      }
    }
    if (urls.length) onChange([...value, ...urls]);
  };

  const remove = (index) => onChange(value.filter((_, i) => i !== index));

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xs text-muted tabular-nums">
          {value.length} / {max}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {value.map((url, index) => (
          <div
            key={url}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-base-content/10 bg-base-200"
          >
            <img src={url} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
            {index === 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-neutral px-2 py-0.5 text-[0.65rem] font-semibold text-neutral-content">
                Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={disabled || busy}
              aria-label={`Remove image ${index + 1}`}
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral text-neutral-content shadow transition hover:bg-error hover:text-error-content"
            >
              <LuX size={14} />
            </button>
          </div>
        ))}

        {Array.from({ length: pending }).map((_, i) => (
          <div key={`pending-${i}`} className="skeleton aspect-[4/3] rounded-xl"></div>
        ))}

        {remaining > 0 && (
          <label
            htmlFor={inputId}
            className={`flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-base-content/20 px-2 text-center text-xs font-medium text-muted transition-colors hover:border-primary hover:text-primary focus-within:border-primary ${
              disabled || busy ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <LuImagePlus size={22} aria-hidden="true" />
            <span>{busy ? "Uploading..." : "Add images"}</span>
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              disabled={disabled || busy}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        )}
      </div>
      {helper && <p className="mt-2 text-xs text-muted">{helper}</p>}
    </div>
  );
};

export default ImageUploader;
