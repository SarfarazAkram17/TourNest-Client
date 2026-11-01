export const formatBDT = (value = 0) =>
  `৳${Number(value || 0).toLocaleString("en-BD")}`;

export const compactBDT = (value = 0) => {
  const n = Number(value || 0);
  if (n >= 10000000) return `৳${(n / 10000000).toFixed(1).replace(/\.0$/, "")}Cr`;
  if (n >= 100000) return `৳${(n / 100000).toFixed(1).replace(/\.0$/, "")}L`;
  if (n >= 1000) return `৳${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `৳${n}`;
};

export const formatDate = (value, options = {}) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
};

export const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const timeAgo = (value) => {
  if (!value) return "";
  const seconds = Math.round((Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (seconds >= size) {
      const count = Math.floor(seconds / size);
      return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

export const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "T";

export const shorten = (text = "", max = 18) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

/** Local-noon ISO string for a yyyy-mm-dd value, so the day never shifts across time zones. */
export const dateInputToISO = (value) => {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d, 12).toISOString();
};

export const tomorrowInputValue = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
