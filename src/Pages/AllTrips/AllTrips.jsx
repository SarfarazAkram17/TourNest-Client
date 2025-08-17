import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import Loading from "../../Components/Loading/Loading";
import PackageCard from "../../Components/Shared/PackageCard";
import {
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";

const AllTrips = () => {
  const axiosInstance = useAxios();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["all-packages", page],
    queryFn: async () => {
      const res = await axiosInstance.get("/packages", {
        params: { page },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const packages = data?.packages || data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / data?.limit);

  const handlePageChange = (newPage) => setPage(newPage);

  // filter + sort logic
  const filteredPackages = packages
    .filter((pkg) =>
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto py-7 px-4">
      <h2 className="text-4xl font-bold mb-4 text-center text-primary">
        Explore All Trips
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-6 text-sm md:text-base">
        Discover a curated selection of travel experiences across Bangladesh. Whether you're looking for adventure, relaxation, or cultural
        exploration, our tour packages offer something for every kind of
        traveler.
      </p>

      {/* Search + Sort controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
        {/* Search box */}
        <input
          type="text"
          placeholder="Search trips by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full sm:w-[70%]"
        />

        {/* Sort dropdown */}
        <select
          className="select select-bordered w-full sm:w-[30%]"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by price</option>
          <option value="asc">Price: Low - High</option>
          <option value="desc">Price: High - Low</option>
        </select>
      </div>

      {filteredPackages.length === 0 ? (
        <p className="text-center text-gray-500">No packages found.</p>
      ) : (
        <>
          {/* Packages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg}></PackageCard>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`btn btn-sm ${
                page === 1
                  ? "btn-disabled text-black/40"
                  : "btn-primary text-white"
              }`}
            >
              <MdOutlineKeyboardDoubleArrowLeft size={20} />
            </button>

            {[...Array(totalPages).keys()].map((n) => (
              <button
                key={n}
                onClick={() => handlePageChange(n + 1)}
                className={`btn btn-sm ${
                  page === n + 1 ? "btn-primary text-white" : "btn-outline"
                }`}
              >
                {n + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || totalPages === 0}
              className={`btn btn-sm ${
                page === totalPages || totalPages === 0
                  ? "btn-disabled text-black/40"
                  : "btn-primary text-white"
              }`}
            >
              <MdKeyboardDoubleArrowRight size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllTrips;
