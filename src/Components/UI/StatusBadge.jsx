import { BOOKING_STATUS, PAYMENT_STATUS, ROLE_LABEL } from "../../utils/constants";

const TONES = {
  success: "bg-success/12 text-success ring-success/30",
  warning: "bg-warning/12 text-warning ring-warning/30",
  error: "bg-error/12 text-error ring-error/30",
  info: "bg-info/12 text-info ring-info/30",
  secondary: "bg-secondary/12 text-secondary ring-secondary/30",
  primary: "bg-primary/12 text-primary ring-primary/30",
  neutral: "bg-base-content/8 text-base-content/70 ring-base-content/15",
};

export const Badge = ({ tone = "neutral", children, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${TONES[tone]} ${className}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true"></span>
    {children}
  </span>
);

export const BookingBadge = ({ status }) => {
  const meta = BOOKING_STATUS[status] || { label: status, tone: "neutral" };
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
};

export const PaymentBadge = ({ status }) => {
  const meta = PAYMENT_STATUS[status] || PAYMENT_STATUS.not_paid;
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
};

export const RoleBadge = ({ role }) => {
  const tone = role === "admin" ? "primary" : role === "tour guide" ? "secondary" : "neutral";
  return <Badge tone={tone}>{ROLE_LABEL[role] || role}</Badge>;
};

export default Badge;
