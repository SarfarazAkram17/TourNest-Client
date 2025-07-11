import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Components/Loading/Loading";
import Swal from "sweetalert2";
import Select from "react-select";
import {
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdVisibility,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";

const ManageCandidates = () => {
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();
  const [page, setPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionOptions, setRegionOptions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    fetch("/regions.json")
      .then((res) => res.json())
      .then((data) => {
        const options = data.map((region) => ({
          value: region,
          label: region,
        }));
        setRegionOptions(options);
      });
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["candidates", page, searchTerm, selectedRegion],
    queryFn: async () => {
      const res = await axiosSecure.get(`/applications?email=${userEmail}`, {
        params: {
          page,
          limit: 10,
          status: "pending",
          search: searchTerm,
          region: selectedRegion?.value || "",
        },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const candidates = data?.applications || [];
  const totalPages = Math.ceil((data?.total || 0) / 10);

  const handlePageChange = (newPage) => setPage(newPage);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };
  const handleRegionChange = (selected) => {
    setSelectedRegion(selected);
    setPage(1);
  };

  const handleView = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  // Confirm before Accepting
  const handleAccept = (candidate) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Accept ${candidate.name} as a tour guide?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, accept",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(
            `/applications?email=${userEmail}`,
            { role: "tour guide", candidateEmail: candidate.email }
          );

          if (res.data.modifiedCount > 0) {
            await axiosSecure.delete(
              `/applications/${candidate._id}?email=${userEmail}`
            );
            Swal.fire(
              "Accepted!",
              `${candidate.name} is now a tour guide.`,
              "success"
            );
            refetch();
          }
        } catch (error) {
          Swal.fire(
            error.message,
            "Something went wrong while accepting.",
            "error"
          );
        }
      }
    });
  };

  // Confirm before Rejecting
  const handleReject = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Reject this application?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/applications/${id}?email=${userEmail}`);
          Swal.fire("Rejected", "The application has been removed.", "info");
          refetch();
        } catch (error) {
          Swal.fire(
            error.message,
            "Something went wrong while rejecting.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        Manage Candidates
      </h2>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <label className="input input-bordered w-full md:w-1/3">
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

        <Select
          options={regionOptions}
          isClearable
          value={selectedRegion}
          onChange={handleRegionChange}
          placeholder="Filter by region"
          className="w-full md:w-1/3"
        />
      </div>

      {isLoading ? (
        <Loading />
      ) : candidates.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No pending applications.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto border border-base-content/10 rounded-lg">
            <table className="table w-full text-center table-sm">
              <thead>
                <tr className="bg-base-200">
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Region</th>
                  <th>District</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((app, i) => (
                  <tr key={app._id}>
                    <td>{(page - 1) * 10 + i + 1}</td>
                    <td>{app.name}</td>
                    <td>{app.email}</td>
                    <td>{app.region}</td>
                    <td>{app.district}</td>
                    <td>{app.phone}</td>
                    <td className="flex gap-1 justify-center items-center flex-wrap">
                      <button
                        className="btn btn-xs btn-info text-white"
                        onClick={() => handleView(app)}
                      >
                        <MdVisibility size={16} />
                      </button>
                      <button
                        className="btn btn-xs btn-success text-white"
                        onClick={() => handleAccept(app)}
                      >
                        <MdCheckCircle size={16} />
                      </button>
                      <button
                        className="btn btn-xs btn-error text-white"
                        onClick={() => handleReject(app._id)}
                      >
                        <MdCancel size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6 flex-wrap gap-2">
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

      {showModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 px-2">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 relative shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-primary text-center">
              Candidate Details
            </h3>
            <button
              className="absolute right-3 top-3 text-gray-500 hover:text-red-600 text-lg"
              onClick={() => {
                setShowModal(false);
                setSelectedCandidate(null);
              }}
            >
              ✕
            </button>
            <div className="space-y-2 text-sm md:text-base pb-4">
              <p>
                <strong>Name:</strong> {selectedCandidate.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedCandidate.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedCandidate.phone}
              </p>
              <p>
                <strong>Region:</strong> {selectedCandidate.region}
              </p>
              <p>
                <strong>District:</strong> {selectedCandidate.district}
              </p>
              <p>
                <strong>Application Title:</strong>{" "}
                {selectedCandidate.applicationTitle}
              </p>
              <p>
                <strong>Reason:</strong> {selectedCandidate.reason}
              </p>
              <p>
                <strong>CV Link:</strong>{" "}
                <a
                  href={selectedCandidate.cvLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  View CV
                </a>
              </p>
              <p>
                <strong>Experience:</strong> {selectedCandidate.experience}{" "}
                years
              </p>
              <p>
                <strong>Languages:</strong>{" "}
                {selectedCandidate.languages.join(", ")}
              </p>
              <p>
                <strong>Bio:</strong> {selectedCandidate.bio}
              </p>
              <p>
                <strong>Age:</strong> {selectedCandidate.age}
              </p>
              <p>
                <strong>Submitted:</strong>{" "}
                {new Date(selectedCandidate.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCandidates;
