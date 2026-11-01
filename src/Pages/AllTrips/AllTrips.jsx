import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { LuSearchX } from "react-icons/lu";
import useAxios from "../../Hooks/useAxios";
import useDebounce from "../../Hooks/useDebounce";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import PackageCard from "../../Components/Shared/PackageCard";
import SearchInput from "../../Components/UI/SearchInput";
import Pagination from "../../Components/UI/Pagination";
import EmptyState from "../../Components/UI/EmptyState";
import { CardGridSkeleton } from "../../Components/UI/Skeletons";

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const AllTrips = () => {
  useDocumentTitle("All trips");
  const axiosInstance = useAxios();
  const [params, setParams] = useSearchParams();

  const page = Math.max(parseInt(params.get("page")) || 1, 1);
  const type = params.get("type") || "";
  const sort = params.get("sort") || "newest";
  const [searchInput, setSearchInput] = useState(params.get("search") || "");
  const search = useDebounce(searchInput.trim(), 350);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      if (value && value !== "newest" && !(key === "page" && value === 1)) next.set(key, value);
      else next.delete(key);
    });
    setParams(next, { replace: true });
  };

  // keep the URL in sync with the debounced search term
  useEffect(() => {
    if ((params.get("search") || "") !== search) update({ search, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const { data: types = [] } = useQuery({
    queryKey: ["package-types"],
    queryFn: async () => (await axiosInstance.get("/packages/types")).data,
    staleTime: 10 * 60 * 1000,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["all-packages", page, search, type, sort],
    queryFn: async () =>
      (await axiosInstance.get("/packages", { params: { page, search, type, sort } })).data,
    placeholderData: keepPreviousData,
  });

  const packages = data?.packages || [];
  const totalPages = Math.ceil((data?.total || 0) / (data?.limit || 12));
  const hasFilters = !!(search || type || sort !== "newest");

  const clearFilters = () => {
    setSearchInput("");
    setParams({}, { replace: true });
  };

  return (
    <>
      <section className="border-b border-base-content/10 bg-base-200">
        <div className="container-page py-10 md:py-14">
          <h1 className="h-section">Find your next trip</h1>
          <p className="mt-3 max-w-2xl text-muted sm:text-lg">
            Adventure, nature, heritage and more. Filter by trip type, sort by price, and open any
            trip for the full itinerary.
          </p>

          <div className="mt-7 grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search by trip name or location"
            />
            <select
              className="select w-full"
              value={type}
              onChange={(e) => update({ type: e.target.value, page: 1 })}
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
              onChange={(e) => update({ sort: e.target.value, page: 1 })}
              aria-label="Sort trips"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="mb-6 flex min-h-8 items-center justify-between gap-3 text-sm text-muted" aria-live="polite">
          <p>
            {isLoading
              ? "Loading trips..."
              : `${data?.total || 0} ${data?.total === 1 ? "trip" : "trips"} found`}
          </p>
          {hasFilters && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : packages.length === 0 ? (
          <EmptyState
            icon={LuSearchX}
            title="No trips match your search"
            description="Try a different keyword, or remove a filter to see more trips."
          >
            <button type="button" className="btn btn-primary" onClick={clearFilters}>
              Show all trips
            </button>
          </EmptyState>
        ) : (
          <div
            className={`grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
              isFetching ? "opacity-60" : ""
            }`}
          >
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={(p) => {
            update({ page: p });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </section>
    </>
  );
};

export default AllTrips;
