import Avatar from "../UI/Avatar";
import { BookingBadge } from "../UI/StatusBadge";
import { formatBDT, formatDate } from "../../utils/format";
import { getBookingStatus } from "../../utils/constants";

/**
 * Compact list of bookings used on every dashboard.
 * `person` picks which name/photo to show: "tourist" or "guide".
 */
const BookingList = ({ bookings = [], person = "tourist", renderAction, emptyMessage }) => {
  if (!bookings.length) {
    return (
      <p className="rounded-xl border border-dashed border-base-content/15 px-4 py-10 text-center text-sm text-muted">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-base-content/10">
      {bookings.map((b) => {
        const name = person === "guide" ? b.tourGuideName : b.touristName;
        const photo = person === "guide" ? b.tourGuideImage : b.touristImage;
        return (
          <li key={b._id} className="flex flex-wrap items-center gap-x-4 gap-y-3 py-3.5 first:pt-0 last:pb-0">
            <Avatar src={photo} name={name} size="md" />
            <div className="min-w-0 flex-1 basis-40">
              <p className="truncate text-sm font-bold" title={b.packageName}>
                {b.packageName}
              </p>
              <p className="truncate text-xs text-muted">
                {name} on {formatDate(b.tourDate || b.bookingAt)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold tabular-nums">{formatBDT(b.price)}</span>
              <BookingBadge status={getBookingStatus(b)} />
              {renderAction?.(b)}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default BookingList;
