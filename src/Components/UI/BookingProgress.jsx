import { LuCheck, LuX } from "react-icons/lu";
import { getBookingStatus } from "../../utils/constants";

const STEPS = ["Booked", "Paid", "Confirmed", "Completed"];

/** Visual timeline of where a booking is in the workflow. */
const BookingProgress = ({ booking }) => {
  const status = getBookingStatus(booking);
  const ended = status === "rejected" || status === "cancelled";

  const reached = {
    pending: 1,
    "in review": 2,
    accepted: 3,
    completed: 4,
    rejected: booking.payment_status === "not_paid" ? 1 : 2,
    cancelled: booking.payment_status === "not_paid" ? 1 : 2,
  }[status] ?? 1;

  return (
    <div>
      <ol className="flex items-start" aria-label="Booking progress">
        {STEPS.map((step, index) => {
          const done = index < reached;
          const isLast = index === STEPS.length - 1;
          return (
            <li
              key={step}
              className={`relative flex min-w-0 flex-1 flex-col items-center text-center ${
                isLast ? "" : ""
              }`}
              aria-current={index === reached - 1 && !ended ? "step" : undefined}
            >
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 top-3.5 h-0.5 w-full ${
                    index < reached - 1 ? "bg-primary" : "bg-base-content/15"
                  }`}
                />
              )}
              <span
                className={`relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  done
                    ? "border-primary bg-primary text-primary-content"
                    : "border-base-content/20 bg-base-100 text-muted"
                }`}
              >
                {done ? <LuCheck size={14} /> : index + 1}
              </span>
              <span className={`mt-2 text-[0.7rem] font-medium sm:text-xs ${done ? "" : "text-muted"}`}>
                {step}
              </span>
            </li>
          );
        })}
      </ol>
      {ended && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-error/10 px-3 py-2 text-sm text-error">
          <LuX size={16} aria-hidden="true" />
          {status === "rejected"
            ? "The guide declined this booking."
            : "This booking was cancelled."}
          {booking.payment_status === "refunded" && " Your payment was refunded."}
        </p>
      )}
    </div>
  );
};

export default BookingProgress;
