import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import Loading from "../../../Components/Loading/Loading";
import {
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";

const MyAssignedTours = () => {
  const { userEmail } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["assignedTours", userEmail, page, searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/tourGuide/assigned?email=${userEmail}`,
        {
          params: {
            page,
            limit: 10,
            search: searchTerm,
          },
        }
      );
      return res.data;
    },
    keepPreviousData: true,
    enabled: !!userEmail,
    refetchInterval: 5000,
  });

  const assignedTours = data?.bookings || [];
  const totalPages = Math.ceil((data?.total || 0) / 10);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleAccept = async (id, status) => {
    if (status !== "in review") return;

    try {
      await axiosSecure.patch(`/bookings/${id}?email=${userEmail}`, {
        status: "accepted",
      });
      Swal.fire("Accepted!", "You have accepted the tour.", "success");
      refetch();
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to accept tour.", "error");
    }
  };

  const handleReject = async (id, status) => {
    if (status !== "pending") return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Rejecting this tour will change its status to 'Rejected'.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/bookings/${id}?email=${userEmail}`, {
          status: "rejected",
        });
        Swal.fire("Rejected!", "Tour has been rejected.", "success");
        refetch();
      } catch (error) {
        Swal.fire("Error", error.message || "Failed to reject tour.", "error");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">
        My Assigned Tours
      </h2>

      {/* Search */}
      <label className="input input-bordered w-full mb-8">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="search"
          placeholder="Search by package name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />
      </label>

      {isLoading ? (
        <Loading />
      ) : assignedTours.length === 0 ? (
        <p className="text-center text-gray-600 text-xl mt-6">
          No assigned tours found.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto border border-base-content/10 rounded-lg">
            <table className="table w-full text-center table-xs">
              <thead>
                <tr className="bg-base-200 text-sm">
                  <th>#</th>
                  <th>Package Name</th>
                  <th>Tourist Name</th>
                  <th>Tour Date</th>
                  <th>Tour Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedTours.map((tour, i) => (
                  <tr key={tour._id}>
                    <td>{(page - 1) * 10 + i + 1}</td>
                    <td>{tour.packageName}</td>
                    <td>{tour.touristName}</td>
                    <td>
                      {new Date(tour.tourDate).toLocaleDateString("en-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td>৳{tour.price.toLocaleString("en-BD")}</td>
                    <td className="capitalize">
                      {tour.status === "pending" ? (
                        <span className="text-gray-600">Pending</span>
                      ) : tour.status === "in review" ? (
                        <span className="text-blue-600 font-semibold">
                          In Review
                        </span>
                      ) : tour.status === "accepted" ? (
                        <span className="text-green-600 font-semibold">
                          Accepted
                        </span>
                      ) : (
                        tour.status === "rejected" && (
                          <span className="text-red-600 font-semibold">
                            Rejected
                          </span>
                        )
                      )}
                    </td>
                    <td className="flex items-center justify-center gap-1">
                      {tour.status === "accepted" ||
                      tour.status === "rejected" ? (
                        " - - "
                      ) : (
                        <>
                          <button
                            className={`btn btn-xs ${
                              tour.status === "in review"
                                ? "btn-primary text-white"
                                : "btn-disabled text-black/50"
                            }`}
                            onClick={() => handleAccept(tour._id, tour.status)}
                            title={
                              tour.status === "in review"
                                ? "Accept this tour"
                                : "Accept button disabled"
                            }
                          >
                            Accept
                          </button>

                          {tour.status === "pending" && (
                            <button
                              className="btn btn-xs btn-error text-white"
                              onClick={() =>
                                handleReject(tour._id, tour.status)
                              }
                              title="Reject this tour"
                            >
                              Reject
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default MyAssignedTours;
