import { useState } from "react";
import { getInitials } from "../../utils/format";

const SIZES = {
  xs: "h-7 w-7 text-[0.65rem]",
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-28 w-28 text-3xl sm:h-32 sm:w-32",
};

const Avatar = ({ src, name = "", size = "md", className = "" }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary/12 font-bold text-primary ${SIZES[size]} ${className}`}
      >
        {getInitials(name)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name ? `${name}'s photo` : "Profile photo"}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-full object-cover ${SIZES[size]} ${className}`}
    />
  );
};

export default Avatar;
