// Booking lifecycle (see README "Booking workflow"):
// pending (awaiting payment) -> in review (paid, waiting for guide)
//   -> accepted (confirmed) -> completed (derived once the tour dates pass)
// A booking can also end as rejected (by the guide) or cancelled (by the tourist).
export const BOOKING_STATUS = {
  pending: { label: "Awaiting payment", tone: "warning" },
  "in review": { label: "Guide reviewing", tone: "info" },
  accepted: { label: "Confirmed", tone: "success" },
  completed: { label: "Completed", tone: "secondary" },
  rejected: { label: "Declined", tone: "error" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

export const PAYMENT_STATUS = {
  not_paid: { label: "Unpaid", tone: "warning" },
  paid: { label: "Paid", tone: "success" },
  refunded: { label: "Refunded", tone: "neutral" },
};

export const ROLE_LABEL = {
  admin: "Admin",
  tourist: "Tourist",
  "tour guide": "Tour guide",
};

/** Resolve the status shown to people, turning old accepted tours into "completed". */
export const getBookingStatus = (booking) => {
  if (!booking) return "pending";
  if (booking.status === "accepted" && booking.tourDate) {
    const days = Number(booking.durationDays) || 1;
    const end = new Date(booking.tourDate);
    end.setDate(end.getDate() + days);
    if (end < new Date()) return "completed";
  }
  return booking.status;
};

export const BOOKING_FILTERS = [
  { value: "all", label: "All" },
  { value: "unpaid", label: "Awaiting payment" },
  { value: "in review", label: "In review" },
  { value: "accepted", label: "Confirmed" },
  { value: "rejected", label: "Declined" },
  { value: "cancelled", label: "Cancelled" },
];
