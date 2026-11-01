import { useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { LuCheck, LuClipboardCheck, LuEye, LuX } from "react-icons/lu";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useDebounce from "../../../Hooks/useDebounce";
import useLocations from "../../../Hooks/useLocations";
import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import PageHeader from "../../../Components/UI/PageHeader";
import SearchInput from "../../../Components/UI/SearchInput";
import Pagination from "../../../Components/UI/Pagination";
import EmptyState from "../../../Components/UI/EmptyState";
import Modal from "../../../Components/UI/Modal";
import Avatar from "../../../Components/UI/Avatar";
import { ListSkeleton } from "../../../Components/UI/Skeletons";
import { confirmAction, getErrorMessage } from "../../../utils/alerts";
import { formatDate, formatDateTime } from "../../../utils/format";

const PAGE_SIZE = 10;

const Detail = ({ label, children, wide }) => (
  <div className={wide ? "sm:col-span-2" : ""}>
    <dt className="text-xs text-muted">{label}</dt>
    <dd className="mt-0.5 whitespace-pre-line break-words text-sm font-medium">{children}</dd>
  </div>
);

const ManageCandidates = () => {
  useDocumentTitle("Guide applications");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { userEmail } = useAuth();
  const { regions } = useLocations();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [region, setRegion] = useState("");
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const search = useDebounce(searchInput.trim(), 350);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["candidates", page, search, region],
    queryFn: async () =>
      (
        await axiosSecure.get(`/applications?email=${userEmail}`, {
          params: { page, limit: PAGE_SIZE, status: "pending", search, region },
        })
      ).data,
    placeholderData: keepPreviousData,
    enabled: !!userEmail,
  });

  const candidates = data?.applications || [];
  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["candidates"] });
    queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const handleAccept = async (candidate) => {
    const ok = await confirmAction({
      title: "Approve this guide?",
      text: `${candidate.name} will become a tour guide and can be booked right away.`,
      confirmText: "Approve guide",
    });
    if (!ok) return;

    setBusy(true);
    try {
      await axiosSecure.patch(`/applications?email=${userEmail}`, { applicationId: candidate._id });
      toast.success(`${candidate.name} is now a tour guide.`);
      setSelected(null);
      refresh();
    } catch (error) {
      toast.error(getErrorMessage(error, "We couldn't approve this application."));
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async (candidate) => {
    const ok = await confirmAction({
      title: "Decline this application?",
      text: `${candidate.name} will be able to apply again.`,
      confirmText: "Decline",
      icon: "warning",
      danger: true,
    });
    if (!ok) return;

    setBusy(true);
    try {
      await axiosSecure.delete(`/applications/${candidate._id}?email=${userEmail}`);
      toast.info("Application declined.");
      setSelected(null);
      refresh();
    } catch (error) {
      toast.error(getErrorMessage(error, "We couldn't decline this application."));
    } finally {
      setBusy(false);
    }
  };

  const actions = (c) => (
    <div className="flex flex-wrap gap-2">
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelected(c)}>
        <LuEye size={16} aria-hidden="true" /> Review
      </button>
      <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={() => handleAccept(c)}>
        <LuCheck size={16} aria-hidden="true" /> Approve
      </button>
      <button
        type="button"
        className="btn btn-outline btn-error btn-sm"
        disabled={busy}
        onClick={() => handleReject(c)}
        aria-label={`Decline ${c.name}`}
      >
        <LuX size={16} aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Guide applications"
        description="Review each applicant's experience and CV before approving them as a guide."
      />

      <div className="surface p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_14rem]">
          <SearchInput
            value={searchInput}
            onChange={(v) => {
              setSearchInput(v);
              setPage(1);
            }}
            placeholder="Search by applicant name"
          />
          <select
            className="select w-full"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by region"
          >
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className={`mt-5 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          {isLoading ? (
            <ListSkeleton rows={4} />
          ) : candidates.length === 0 ? (
            <EmptyState
              icon={LuClipboardCheck}
              title="No pending applications"
              description="You're all caught up. New applications will appear here."
              className="border-0 bg-transparent"
            />
          ) : (
            <>
              <div className="scroll-thin hidden overflow-x-auto lg:block">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Location</th>
                      <th>Experience</th>
                      <th>Applied</th>
                      <th>
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((c) => (
                      <tr key={c._id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <Avatar src={c.photo} name={c.name} size="sm" />
                            <div className="min-w-0">
                              <p className="max-w-[14rem] truncate font-semibold">{c.name}</p>
                              <p className="max-w-[14rem] truncate text-xs text-muted">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap">
                          {c.district}, {c.region}
                        </td>
                        <td className="whitespace-nowrap">{c.experience} yrs</td>
                        <td className="whitespace-nowrap">{formatDate(c.createdAt)}</td>
                        <td>{actions(c)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="space-y-3 lg:hidden">
                {candidates.map((c) => (
                  <li key={c._id} className="surface-tint p-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={c.photo} name={c.name} size="md" />
                      <div className="min-w-0">
                        <p className="truncate font-bold">{c.name}</p>
                        <p className="truncate text-xs text-muted">{c.email}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-muted">
                      {c.district}, {c.region}. {c.experience} years of experience. Applied{" "}
                      {formatDate(c.createdAt)}.
                    </p>
                    <div className="mt-4">{actions(c)}</div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      <Modal
        open={!!selected}
        onClose={() => !busy && setSelected(null)}
        title="Application review"
        description={selected?.applicationTitle}
        size="lg"
        footer={
          selected && (
            <>
              <button type="button" className="btn btn-outline btn-error" disabled={busy} onClick={() => handleReject(selected)}>
                Decline
              </button>
              <button type="button" className="btn btn-primary" disabled={busy} onClick={() => handleAccept(selected)}>
                Approve as guide
              </button>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar src={selected.photo} name={selected.name} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-lg font-bold">{selected.name}</p>
                <p className="truncate text-sm text-muted">{selected.email}</p>
              </div>
            </div>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <Detail label="Phone">{selected.phone}</Detail>
              <Detail label="Age">{selected.age}</Detail>
              <Detail label="Region">{selected.region}</Detail>
              <Detail label="District">{selected.district}</Detail>
              <Detail label="Experience">{selected.experience} years</Detail>
              <Detail label="Languages">{(selected.languages || []).join(", ")}</Detail>
              <Detail label="Why they want to guide" wide>
                {selected.reason}
              </Detail>
              <Detail label="Bio" wide>
                {selected.bio}
              </Detail>
              <Detail label="CV" wide>
                <a
                  href={selected.cvLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-primary underline underline-offset-4"
                >
                  Open CV in a new tab
                </a>
              </Detail>
              <Detail label="Submitted">{formatDateTime(selected.createdAt)}</Detail>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageCandidates;
