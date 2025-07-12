import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import Loading from "../../../Components/Loading/Loading";
import { Link } from "react-router";
import {
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";

const MyBookings = () => {
  const { userEmail } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["myBookings", page, searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?email=${userEmail}`, {
        params: {
          page,
          limit: 10,
          search: searchTerm,
        },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const bookings = data?.bookings || [];
  const totalPages = Math.ceil((data?.total || 0) / 10);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This booking will be cancelled.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No, Keep it",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/bookings/${id}?email=${userEmail}`, {
          status: "cancelled",
        });
        Swal.fire("Cancelled", "Booking has been cancelled.", "success");
        refetch();
      } catch (error) {
        Swal.fire(error.message, "Failed to cancel booking.", "error");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">
        My Bookings
      </h2>

      {/* Search */}
      <div className="flex justify-end mb-4">
        <label className="input input-bordered w-full">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>
      </div>

      {isLoading ? (
        <Loading />
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-600 text-xl mt-6">
          No bookings found.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto border border-base-content/10 rounded-lg">
            <table className="table w-full text-center table-xs">
              <thead>
                <tr className="bg-base-200 text-sm">
                  <th>#</th>
                  <th>Package Name</th>
                  <th>Tour Guide Name</th>
                  <th>Tour Date</th>
                  <th>Tour Price</th>
                  <th>Status</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b._id}>
                    <td>{(page - 1) * 10 + i + 1}</td>
                    <td>{b.packageName}</td>
                    <td>{b.tourGuideName}</td>
                    <td>
                      {new Date(b.tourDate).toLocaleDateString("en-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td>৳{b.price.toLocaleString("en-BD")}</td>
                    <td className="capitalize">
                      {b.status !== "pending" ? (
                        b.status === "cancelled" ? (
                          <span className="text-red-500">{b.status}</span>
                        ) : (
                          b.status
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {b.payment_status === "paid" ? (
                        <span className="text-green-600 font-semibold">
                          Paid
                        </span>
                      ) : (
                        <span className="text-orange-500 font-medium">
                          Not Paid
                        </span>
                      )}
                    </td>
                    <td className="flex items-center justify-center gap-1">
                      {b.status === "pending" ? (
                        <>
                          <Link to={`/dashboard/payment/${b._id}`}>
                            <button className="btn btn-xs btn-primary text-white">
                              Pay
                            </button>
                          </Link>

                          <button
                            className="btn btn-xs btn-error text-white"
                            onClick={() => handleCancel(b._id)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        "- -"
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

export default MyBookings;
