import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LuUsers } from "react-icons/lu";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useDebounce from "../../../Hooks/useDebounce";
import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import PageHeader from "../../../Components/UI/PageHeader";
import SearchInput from "../../../Components/UI/SearchInput";
import Pagination from "../../../Components/UI/Pagination";
import EmptyState from "../../../Components/UI/EmptyState";
import Avatar from "../../../Components/UI/Avatar";
import { RoleBadge } from "../../../Components/UI/StatusBadge";
import { ListSkeleton } from "../../../Components/UI/Skeletons";
import { formatDate } from "../../../utils/format";

const PAGE_SIZE = 10;

const ROLE_TABS = [
  { value: "", label: "Everyone" },
  { value: "tourist", label: "Tourists" },
  { value: "tour guide", label: "Guides" },
  { value: "admin", label: "Admins" },
];

const ManageUsers = () => {
  useDocumentTitle("Users");
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();

  const [searchType, setSearchType] = useState("name");
  const [searchInput, setSearchInput] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const search = useDebounce(searchInput.trim(), 350);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["users", searchType, search, role, page],
    queryFn: async () =>
      (
        await axiosSecure.get(`/users?email=${userEmail}`, {
          params: { page, limit: PAGE_SIZE, searchType, search, role },
        })
      ).data,
    placeholderData: keepPreviousData,
    enabled: !!userEmail,
  });

  const users = data?.users || [];
  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);
  const counts = data?.counts || {};

  return (
    <div>
      <PageHeader title="Users" description="Everyone who has joined TourNest." />

      <div className="surface p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
          <select
            className="select w-full"
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              setPage(1);
            }}
            aria-label="Search by"
          >
            <option value="name">Search by name</option>
            <option value="email">Search by email</option>
          </select>
          <SearchInput
            value={searchInput}
            onChange={(v) => {
              setSearchInput(v);
              setPage(1);
            }}
            placeholder={`Search by ${searchType}`}
          />
        </div>

        <div className="scroll-thin -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filter by role">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={role === tab.value}
              onClick={() => {
                setRole(tab.value);
                setPage(1);
              }}
              className={`btn btn-sm shrink-0 rounded-full ${
                role === tab.value ? "btn-primary" : "btn-ghost border border-base-content/15"
              }`}
            >
              {tab.label}
              {counts[tab.value || "all"] !== undefined && (
                <span className="tabular-nums opacity-70">{counts[tab.value || "all"]}</span>
              )}
            </button>
          ))}
        </div>

        <div className={`mt-5 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          {isLoading ? (
            <ListSkeleton rows={6} />
          ) : users.length === 0 ? (
            <EmptyState
              icon={LuUsers}
              title="No users found"
              description={`Try a different ${searchType} or role filter.`}
              className="border-0 bg-transparent"
            />
          ) : (
            <>
              <div className="scroll-thin hidden overflow-x-auto md:block">
                <table className="table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <Avatar src={u.photo} name={u.name} size="sm" />
                            <div className="min-w-0">
                              <p className="max-w-[16rem] truncate font-semibold">{u.name}</p>
                              <p className="max-w-[16rem] truncate text-xs text-muted">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="whitespace-nowrap">{formatDate(u.createdAt || u.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="divide-y divide-base-content/10 md:hidden">
                {users.map((u) => (
                  <li key={u._id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <Avatar src={u.photo} name={u.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{u.name}</p>
                      <p className="truncate text-xs text-muted">{u.email}</p>
                    </div>
                    <RoleBadge role={u.role} />
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

export default ManageUsers;
