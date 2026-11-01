// Chart colours are resolved in JS (SVG attributes cannot read Tailwind classes),
// so each theme has its own tuned palette. Keep these in sync with index.css.
export const chartPalettes = {
  light: {
    series: ["#d9531f", "#0b8a99", "#c98a12", "#5b6cd6", "#d6456b", "#2e9e5b"],
    grid: "#e3e9eb",
    axis: "#5d7279",
    primary: "#d9531f",
    secondary: "#0b8a99",
    surface: "#ffffff",
  },
  dark: {
    series: ["#ff8a63", "#3fc1cf", "#f5c04a", "#8e9cff", "#ff7c9c", "#5bd68d"],
    grid: "#243338",
    axis: "#8fa6ab",
    primary: "#ff8a63",
    secondary: "#3fc1cf",
    surface: "#11191c",
  },
};

export const statusColors = {
  light: {
    Upcoming: "#0b8a99",
    Completed: "#2e9e5b",
    Cancelled: "#8a9ba0",
    Rejected: "#d6456b",
    Pending: "#c98a12",
    Confirmed: "#2e9e5b",
    "In review": "#5b6cd6",
    Declined: "#d6456b",
    "Awaiting payment": "#c98a12",
  },
  dark: {
    Upcoming: "#3fc1cf",
    Completed: "#5bd68d",
    Cancelled: "#8fa6ab",
    Rejected: "#ff7c9c",
    Pending: "#f5c04a",
    Confirmed: "#5bd68d",
    "In review": "#8e9cff",
    Declined: "#ff7c9c",
    "Awaiting payment": "#f5c04a",
  },
};
