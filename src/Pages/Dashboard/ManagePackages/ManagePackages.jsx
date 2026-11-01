import { useState } from "react";
import { Link } from "react-router";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { LuExternalLink, LuMap, LuPackagePlus, LuPencil, LuTrash2 } from "react-icons/lu";
import useAuth from "../../../Hooks/useAuth";
import useAxios from "../../../Hooks/useAxios";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useDebounce from "../../../Hooks/useDebounce";
import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import PageHeader from "../../../Components/UI/PageHeader";
import SearchInput from "../../../Components/UI/SearchInput";
import Pagination from "../../../Components/UI/Pagination";
import EmptyState from "../../../Components/UI/EmptyState";
import { ListSkeleton } from "../../../Components/UI/Skeletons";
import { confirmAction, getErrorMessage } from "../../../utils/alerts";
import { formatBDT } from "../../../utils/format";

const ManagePackages = () => {
  useDocumentTitle("Manage packages");
  const { userEmail } = useAuth();
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("newest");
  const [deletingId, setDeletingId] = useState(null);
  const search = useDebounce(searchInput.trim(), 350);

  const { data: types = [] } = useQuery({
    queryKey: ["package-types"],
    queryFn: async () => (await axiosInstance.get("/packages/types")).data,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["manage-packages", page, search, type, sort],
    queryFn: async () => (await axiosInstance.get("/packages", { params: { page, search, type, sort } })).data,
    placeholderData: keepPreviousData,
  });

  const packages = data?.packages || [];
  const totalPages = Math.ceil((data?.total || 0) / (data?.limit || 12));

  const handleDelete = async (pkg) => {
    const ok = await confirmAction({
      title: "Delete this package?",
      text: `"${pkg.title}" will be removed from the site. Packages with active bookings can't be deleted.`,
      confirmText: "Delete package",
      icon: "warning",
      danger: true,
    });
    if (!ok) return;

    setDeletingId(pkg._id);
    try {
      await axiosSecure.delete(`/packages/${pkg._id}?email=${userEmail}`);
      toast.success("Package deleted.");
      ["manage-packages", "all-packages", "package-types", "adminStats", "randomPackages"].forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] })
      );
      if (packages.length === 1 && page > 1) setPage(page - 1);
    } catch (error) {
      toast.error(getErrorMessage(error, "We couldn't delete this package."));
    } finally {
      setDeletingId(null);
    }
  };

  const actions = (pkg) => (
    <div className="flex flex-wrap items-center gap-2">
      <Link to={`/dashboard/editPackage/${pkg._id}`} className="btn btn-outline btn-sm">
        <LuPencil size={14} aria-hidden="true" /> Edit
      </Link>
      <Link to={`/packages/${pkg._id}`} className="btn btn-ghost btn-sm" aria-label={`View ${pkg.title} on the site`}>
        <LuExternalLink size={16} aria-hidden="true" /> View
      </Link>
      <button
        type="button"
        className="btn btn-ghost btn-sm text-error"
        disabled={deletingId === pkg._id}
        onClick={() => handleDelete(pkg)}
        aria-label={`Delete ${pkg.title}`}
      >
        <LuTrash2 size={16} aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Manage packages"
        description="Edit, preview or remove the tours travelers can book."
        actions={
          <Link to="/dashboard/addPackage" className="btn btn-primary">
            <LuPackagePlus size={18} aria-hidden="true" /> Add package
          </Link>
        }
      />

      <div className="surface p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
          <SearchInput
            value={searchInput}
            onChange={(v) => {
              setSearchInput(v);
              setPage(1);
            }}
            placeholder="Search by title or location"
          />
          <select
            className="select w-full"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by trip type"
          >
            <option value="">All trip types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            className="select w-full"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            aria-label="Sort packages"
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>

        <p className="mt-4 text-sm text-muted" aria-live="polite">
          {data ? `${data.total} ${data.total === 1 ? "package" : "packages"}` : ""}
        </p>

        <div className={`mt-3 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          {isLoading ? (
            <ListSkeleton rows={5} />
          ) : packages.length === 0 ? (
            <EmptyState
              icon={LuMap}
              title="No packages found"
              description="Try a different search or filter, or add a new package."
              className="border-0 bg-transparent"
            >
              <Link to="/dashboard/addPackage" className="btn btn-primary btn-sm">
                Add package
              </Link>
            </EmptyState>
          ) : (
            <>
              <div className="scroll-thin hidden overflow-x-auto md:block">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Package</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Price</th>
                      <th>
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg._id}>
                        <td className="max-w-[18rem]">
                          <div className="flex items-center gap-3">
                            <img
                              src={pkg.images?.[0]}
                              alt=""
                              loading="lazy"
                              className="h-12 w-16 shrink-0 rounded-lg bg-base-200 object-cover"
                            />
                            <div className="min-w-0">
                              <p className="truncate font-bold" title={pkg.title}>
                                {pkg.title}
                              </p>
                              <p className="truncate text-xs text-muted">{pkg.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap">{pkg.tourType}</td>
                        <td className="whitespace-nowrap">{pkg.duration}</td>
                        <td className="whitespace-nowrap font-bold tabular-nums">{formatBDT(pkg.price)}</td>
                        <td>{actions(pkg)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="space-y-3 md:hidden">
                {packages.map((pkg) => (
                  <li key={pkg._id} className="surface-tint overflow-hidden">
                    <img src={pkg.images?.[0]} alt="" loading="lazy" className="aspect-[16/8] w-full bg-base-200 object-cover" />
                    <div className="p-4">
                      <p className="font-bold leading-snug">{pkg.title}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {pkg.location}, {pkg.duration}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="rounded-full bg-base-content/8 px-2.5 py-1 text-xs font-medium">{pkg.tourType}</span>
                        <span className="font-bold tabular-nums">{formatBDT(pkg.price)}</span>
                      </div>
                      <div className="mt-4">{actions(pkg)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
};

export default ManagePackages;
