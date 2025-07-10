import { useState, useEffect } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Components/Loading/Loading";

const searchOptions = [
  { value: "name", label: "Search by Name" },
  { value: "email", label: "Search by Email" },
];

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "tourist", label: "Tourist" },
  { value: "tour guide", label: "Tour Guide" },
  { value: "admin", label: "Admin" },
];

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();

  const [searchType, setSearchType] = useState(searchOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(roleOptions[0]);
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", searchType.value, searchTerm, roleFilter.value, page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?email=${userEmail}`, {
        params: {
          page,
          limit: 10,
          searchType: searchType.value,
          search: searchTerm,
          role: roleFilter.value,
        },
      });
      return res.data;
    },
    keepPreviousData: false,
  });

  const users = data?.users || [];
  const totalPages = Math.ceil((data?.total || 0) / 10);

  // Refetch on every keystroke or delete
  useEffect(() => {
    refetch();
  }, [searchTerm, searchType, roleFilter, page]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleSearchTypeChange = (selected) => {
    setSearchType(selected);
    setSearchTerm("");
    setPage(1);
  };

  const handleRoleFilterChange = (selected) => {
    setRoleFilter(selected);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-primary">
        Manage Users
      </h2>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <Select
          options={searchOptions}
          value={searchType}
          onChange={handleSearchTypeChange}
          className="w-full md:w-1/3"
        />
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
            required
            placeholder={`Search by ${searchType.value}`}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>

        <Select
          options={roleOptions}
          value={roleFilter}
          onChange={handleRoleFilterChange}
          className="w-full md:w-1/3"
        />
      </div>

      {isLoading ? (
        <Loading />
      ) : users.length === 0 ? (
        <p className="text-center mt-10 text-gray-600 text-lg font-medium">
          No users found. Try a different role or search by {searchType.value}.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200">
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user._id}>
                    <td>{(page - 1) * 10 + i + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className="capitalize">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {[...Array(totalPages).keys()].map((n) => (
              <button
                key={n}
                onClick={() => handlePageChange(n + 1)}
                className={`btn btn-sm ${
                  page === n + 1 ? "btn-primary" : "btn-outline"
                }`}
              >
                {n + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUsers;
