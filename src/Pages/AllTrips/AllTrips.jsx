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

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto py-7 px-4">
      <h2 className="text-4xl font-bold mb-4 text-center text-primary">
        Explore All Trips
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10 text-sm md:text-base">
        Discover a curated selection of travel experiences across Bangladesh. Whether you're looking for adventure, relaxation, or cultural
        exploration, our tour packages offer something for every kind of
        traveler.
      </p>

      {packages.length === 0 ? (
        <p className="text-center text-gray-500">No packages available.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
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
