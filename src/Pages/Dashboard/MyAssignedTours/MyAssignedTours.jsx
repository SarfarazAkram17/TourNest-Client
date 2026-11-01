import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LuCalendarX, LuEye } from "react-icons/lu";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useBookingActions from "../../../Hooks/useBookingActions";
import useDebounce from "../../../Hooks/useDebounce";
import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import PageHeader from "../../../Components/UI/PageHeader";
import SearchInput from "../../../Components/UI/SearchInput";
import Pagination from "../../../Components/UI/Pagination";
import EmptyState from "../../../Components/UI/EmptyState";
import Avatar from "../../../Components/UI/Avatar";
import Modal from "../../../Components/UI/Modal";
import BookingProgress from "../../../Components/UI/BookingProgress";
import { BookingBadge, PaymentBadge } from "../../../Components/UI/StatusBadge";
import { ListSkeleton } from "../../../Components/UI/Skeletons";
import { getBookingStatus } from "../../../utils/constants";
import { formatBDT, formatDate, formatDateTime } from "../../../utils/format";

const PAGE_SIZE = 10;

const FILTERS = [
  { value: "all", label: "All" },
  { value: "in review", label: "Needs your response" },
  { value: "accepted", label: "Confirmed" },
  { value: "pending", label: "Awaiting payment" },
  { value: "rejected", label: "Declined" },
];

const MyAssignedTours = () => {
  useDocumentTitle("Assigned tours");
  const { userEmail } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { accept, reject, busyId } = useBookingActions();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const search = useDebounce(searchInput.trim(), 350);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["assignedTours", userEmail, page, search, status],
    queryFn: async () =>
      (
        await axiosSecure.get(`/bookings/tourGuide/assigned?email=${userEmail}`, {
          params: { page, limit: PAGE_SIZE, search, status },
        })
      ).data,
    placeholderData: keepPreviousData,
    enabled: !!userEmail,
    refetchInterval: 15000,
  });

  const tours = data?.bookings || [];
  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  const detailsButton = (t) => (
    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelected(t)}>
      <LuEye size={16} aria-hidden="true" /> Details
    </button>
  );

  const renderActions = (t) => (
    <div className="flex flex-wrap items-center gap-2">
      {t.status === "in review" && (
        <>
          <button type="button" className="btn btn-primary btn-sm" disabled={busyId === t._id} onClick={() => accept(t)}>
            Accept
          </button>
          <button type="button" className="btn btn-outline btn-error btn-sm" disabled={busyId === t._id} onClick={() => reject(t)}>
            Decline
          </button>
        </>
      )}
      {t.status === "pending" && (
        <button type="button" className="btn btn-ghost btn-sm text-error" disabled={busyId === t._id} onClick={() => reject(t)}>
          Decline
        </button>
      )}
      {detailsButton(t)}
    </div>
  );

  // keep the open dialog in sync with refreshed data
  const selectedLive = selected ? tours.find((t) => t._id === selected._id) || selected : null;

  return (
    <div>
      <PageHeader
        title="Assigned tours"
        description="Travelers who booked you. Accept paid bookings to confirm the trip."
      />

      <div className="surface p-4 sm:p-5">
        <SearchInput
          value={searchInput}
          onChange={(v) => {
            setSearchInput(v);
            setPage(1);
          }}
          placeholder="Search by package name"
        />

        <div className="scroll-thin -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filter tours">
          {FILTERS.map((f) => (
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
          ) : tours.length === 0 ? (
            <EmptyState
              icon={LuCalendarX}
              title="No tours here"
              description={
                status === "all" && !search
                  ? "When a traveler books you, the request shows up on this page."
                  : "Try a different filter or search term."
              }
              className="border-0 bg-transparent"
            />
          ) : (
            <>
              <div className="scroll-thin hidden overflow-x-auto md:block">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Traveler</th>
                      <th>Trip</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tours.map((t) => (
                      <tr key={t._id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <Avatar src={t.touristImage} name={t.touristName} size="sm" />
                            <span className="max-w-[9rem] truncate font-semibold">{t.touristName}</span>
                          </div>
                        </td>
                        <td className="max-w-[14rem]">
                          <p className="truncate font-bold" title={t.packageName}>
                            {t.packageName}
                          </p>
                          <p className="text-xs tabular-nums text-muted">{formatBDT(t.price)}</p>
                        </td>
                        <td className="whitespace-nowrap">{formatDate(t.tourDate)}</td>
                        <td>
                          <BookingBadge status={getBookingStatus(t)} />
                        </td>
                        <td>{renderActions(t)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="space-y-3 md:hidden">
                {tours.map((t) => (
                  <li key={t._id} className="surface-tint p-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={t.touristImage} name={t.touristName} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{t.touristName}</p>
                        <p className="text-xs text-muted">{formatDate(t.tourDate)}</p>
                      </div>
                    </div>
                    <p className="mt-3 font-bold leading-snug">{t.packageName}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <BookingBadge status={getBookingStatus(t)} />
                      <span className="text-sm font-bold tabular-nums">{formatBDT(t.price)}</span>
                    </div>
                    <div className="mt-4">{renderActions(t)}</div>
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
        description="Tour details"
        size="md"
        footer={
          selectedLive && (selectedLive.status === "in review" || selectedLive.status === "pending") ? (
            <>
              <button
                type="button"
                className="btn btn-outline btn-error"
                disabled={busyId === selectedLive._id}
                onClick={async () => {
                  if (await reject(selectedLive)) setSelected(null);
                }}
              >
                Decline
              </button>
              {selectedLive.status === "in review" && (
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={busyId === selectedLive._id}
                  onClick={async () => {
                    if (await accept(selectedLive)) setSelected(null);
                  }}
                >
                  Accept tour
                </button>
              )}
            </>
          ) : null
        }
      >
        {selectedLive && (
          <div className="space-y-6">
            <BookingProgress booking={selectedLive} />
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <div className="col-span-2">
                <dt className="mb-1 text-xs text-muted">Traveler</dt>
                <dd className="flex items-center gap-2 font-semibold">
                  <Avatar src={selectedLive.touristImage} name={selectedLive.touristName} size="xs" />
                  <span className="min-w-0 truncate">{selectedLive.touristName}</span>
                </dd>
                <dd className="mt-1 break-all text-xs text-muted">{selectedLive.touristEmail}</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-muted">Travel date</dt>
                <dd className="font-semibold">{formatDate(selectedLive.tourDate)}</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-muted">Price</dt>
                <dd className="font-semibold tabular-nums">{formatBDT(selectedLive.price)}</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-muted">Status</dt>
                <dd>
                  <BookingBadge status={getBookingStatus(selectedLive)} />
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

export default MyAssignedTours;
