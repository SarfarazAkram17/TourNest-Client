import { useEffect, useState } from "react";
import { Link } from "react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Confetti from "react-confetti";
import { LuCreditCard, LuEye, LuLuggage, LuPartyPopper, LuX } from "react-icons/lu";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useBookingActions from "../../../Hooks/useBookingActions";
import useDebounce from "../../../Hooks/useDebounce";
import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import useWindowSize from "../../../Hooks/useWindowSize";
import PageHeader from "../../../Components/UI/PageHeader";
import SearchInput from "../../../Components/UI/SearchInput";
import Pagination from "../../../Components/UI/Pagination";
import EmptyState from "../../../Components/UI/EmptyState";
import Modal from "../../../Components/UI/Modal";
import Avatar from "../../../Components/UI/Avatar";
import BookingProgress from "../../../Components/UI/BookingProgress";
import { BookingBadge, PaymentBadge } from "../../../Components/UI/StatusBadge";
import { ListSkeleton } from "../../../Components/UI/Skeletons";
import { BOOKING_FILTERS, getBookingStatus } from "../../../utils/constants";
import { formatBDT, formatDate, formatDateTime } from "../../../utils/format";

const PAGE_SIZE = 10;
const CONFETTI_KEY = "tournest-confetti-shown";

const MyBookings = () => {
  useDocumentTitle("My bookings");
  const { userEmail } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { cancel, busyId } = useBookingActions();
  const { width, height } = useWindowSize();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const search = useDebounce(searchInput.trim(), 350);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["myBookings", userEmail, page, search, status],
    queryFn: async () =>
      (
        await axiosSecure.get(`/bookings?email=${userEmail}`, {
          params: { page, limit: PAGE_SIZE, search, status },
        })
      ).data,
    placeholderData: keepPreviousData,
    enabled: !!userEmail,
  });

  const bookings = data?.bookings || [];
  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  useEffect(() => {
    if ((data?.paidTotal || 0) >= 3 && !sessionStorage.getItem(CONFETTI_KEY)) {
      sessionStorage.setItem(CONFETTI_KEY, "1");
      setCelebrate(true);
    }
  }, [data?.paidTotal]);

  const handleCancel = async (booking) => {
    const done = await cancel(booking);
    if (done) setSelected(null);
  };

  const renderActions = (b) => {
    const current = b.status;
    return (
      <div className="flex flex-wrap items-center gap-2">
        {current === "pending" && (
          <Link to={`/dashboard/payment/${b._id}`} className="btn btn-primary btn-sm">
            <LuCreditCard size={16} aria-hidden="true" /> Pay
          </Link>
        )}
        {(current === "pending" || current === "in review") && (
          <button
            type="button"
            className="btn btn-outline btn-error btn-sm"
            disabled={busyId === b._id}
            onClick={() => handleCancel(b)}
          >
            Cancel
          </button>
        )}
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelected(b)}>
          <LuEye size={16} aria-hidden="true" /> Details
        </button>
      </div>
    );
  };

  // keep the open dialog in sync with refreshed data
  const selectedLive = selected ? bookings.find((b) => b._id === selected._id) || selected : null;

  return (
    <div>
      {celebrate && (
        <>
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={450}
            style={{ position: "fixed", pointerEvents: "none", zIndex: 60 }}
            onConfettiComplete={() => setCelebrate(false)}
          />
          <div
            role="status"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 p-4"
          >
            <LuPartyPopper size={22} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="font-bold">Three paid trips and counting!</p>
              <p className="text-sm text-muted">Thank you for travelling with TourNest.</p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-xs btn-circle"
              aria-label="Dismiss"
              onClick={() => setCelebrate(false)}
            >
              <LuX size={16} />
            </button>
          </div>
        </>
      )}

      <PageHeader
        title="My bookings"
        description="Track payments and see what your guide has confirmed."
        actions={
          <Link to="/allTrips" className="btn btn-primary">
            Book a new trip
          </Link>
        }
      />

      <div className="surface p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <SearchInput
            value={searchInput}
            onChange={(v) => {
              setSearchInput(v);
              setPage(1);
            }}
            placeholder="Search by package name"
          />
        </div>

        <div className="scroll-thin -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filter bookings">
          {BOOKING_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={status === f.value}
              onClick={() => {
                setStatus(f.value);
                setPage(1);
              }}
              className={`btn btn-sm shrink-0 rounded-full ${
                status === f.value ? "btn-primary" : "btn-ghost border border-base-content/15"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={`mt-5 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          {isLoading ? (
            <ListSkeleton rows={5} />
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={LuLuggage}
              title={search || status !== "all" ? "No bookings match" : "No bookings yet"}
              description={
                search || status !== "all"
                  ? "Try another filter or search term."
                  : "Reserve your first trip and it will show up here."
              }
              className="border-0 bg-transparent"
            >
              <Link to="/allTrips" className="btn btn-primary btn-sm">
                Explore trips
              </Link>
            </EmptyState>
          ) : (
            <>
              {/* Desktop table */}
              <div className="scroll-thin hidden overflow-x-auto md:block">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Trip</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id}>
                        <td className="max-w-[16rem]">
                          <div className="flex items-center gap-3">
                            <Avatar src={b.tourGuideImage} name={b.tourGuideName} size="sm" />
                            <div className="min-w-0">
                              <p className="truncate font-bold" title={b.packageName}>
                                {b.packageName}
                              </p>
                              <p className="truncate text-xs text-muted">Guide: {b.tourGuideName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap">{formatDate(b.tourDate)}</td>
                        <td>
                          <p className="font-bold tabular-nums">{formatBDT(b.price)}</p>
                          <PaymentBadge status={b.payment_status} />
                        </td>
                        <td>
                          <BookingBadge status={getBookingStatus(b)} />
                        </td>
                        <td>{renderActions(b)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <ul className="space-y-3 md:hidden">
                {bookings.map((b) => (
                  <li key={b._id} className="surface-tint p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold leading-snug">{b.packageName}</p>
                        <p className="mt-0.5 text-xs text-muted">
                          {formatDate(b.tourDate)} with {b.tourGuideName}
                        </p>
                      </div>
                      <p className="shrink-0 font-bold tabular-nums">{formatBDT(b.price)}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <BookingBadge status={getBookingStatus(b)} />
                      <PaymentBadge status={b.payment_status} />
                    </div>
                    <div className="mt-4">{renderActions(b)}</div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      <Modal
        open={!!selectedLive}
        onClose={() => setSelected(null)}
        title={selectedLive?.packageName}
        description="Booking details"
        size="md"
        footer={
          selectedLive && (
            <>
              {selectedLive.status === "pending" && (
                <Link to={`/dashboard/payment/${selectedLive._id}`} className="btn btn-primary">
                  Continue to payment
                </Link>
              )}
              {(selectedLive.status === "pending" || selectedLive.status === "in review") && (
                <button
                  type="button"
                  className="btn btn-outline btn-error"
                  disabled={busyId === selectedLive._id}
                  onClick={() => handleCancel(selectedLive)}
                >
                  Cancel booking
                </button>
              )}
            </>
          )
        }
      >
        {selectedLive && (
          <div className="space-y-6">
            <BookingProgress booking={selectedLive} />
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <div>
                <dt className="mb-1 text-xs text-muted">Travel date</dt>
                <dd className="font-semibold">{formatDate(selectedLive.tourDate)}</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-muted">Price</dt>
                <dd className="font-semibold tabular-nums">{formatBDT(selectedLive.price)}</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-muted">Guide</dt>
                <dd className="flex items-center gap-2 font-semibold">
                  <Avatar src={selectedLive.tourGuideImage} name={selectedLive.tourGuideName} size="xs" />
                  <span className="min-w-0 truncate">{selectedLive.tourGuideName}</span>
                </dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-muted">Payment</dt>
                <dd>
                  <PaymentBadge status={selectedLive.payment_status} />
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="mb-1 text-xs text-muted">Booked on</dt>
                <dd className="font-semibold">{formatDateTime(selectedLive.bookingAt)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="mb-1 text-xs text-muted">Booking ID</dt>
                <dd className="break-all font-mono text-xs">{selectedLive._id}</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyBookings;
