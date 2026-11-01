import { useState } from "react";
import { Link } from "react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { LuBookOpenText, LuPenLine } from "react-icons/lu";
import useAxios from "../../Hooks/useAxios";
import useAuth from "../../Hooks/useAuth";
import useDebounce from "../../Hooks/useDebounce";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import StoryCard from "../../Components/Shared/StoryCard";
import SearchInput from "../../Components/UI/SearchInput";
import Pagination from "../../Components/UI/Pagination";
import EmptyState from "../../Components/UI/EmptyState";
import { CardGridSkeleton } from "../../Components/UI/Skeletons";

const Community = () => {
  useDocumentTitle("Community stories");
  const axiosInstance = useAxios();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput.trim(), 350);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["community-stories", page, search],
    queryFn: async () => (await axiosInstance.get("/stories", { params: { page, search } })).data,
    placeholderData: keepPreviousData,
  });

  const stories = data?.stories || [];
  const totalPages = Math.ceil((data?.total || 0) / (data?.limit || 12));

  return (
    <>
      <section className="border-b border-base-content/10 bg-base-200">
        <div className="container-page flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between md:py-14">
          <div className="max-w-2xl">
            <h1 className="h-section">Stories from our community</h1>
            <p className="mt-3 text-muted sm:text-lg">
              Hidden gems and unforgettable days, written by travelers and guides across
              Bangladesh.
            </p>
          </div>
          <Link
            to={user ? "/dashboard/addStories" : "/login"}
            state={user ? undefined : "/dashboard/addStories"}
            className="btn btn-primary self-start md:self-auto"
          >
            <LuPenLine size={18} aria-hidden="true" /> Share your story
          </Link>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="mb-8 max-w-md">
          <SearchInput
            value={searchInput}
            onChange={(v) => {
              setSearchInput(v);
              setPage(1);
            }}
            placeholder="Search stories by title or place"
          />
        </div>

        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : stories.length === 0 ? (
          <EmptyState
            icon={LuBookOpenText}
            title={search ? "No stories match your search" : "No stories yet"}
            description={
              search
                ? "Try a different keyword."
                : "Be the first to share a story from your travels."
            }
          />
        ) : (
          <div
            className={`grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
              isFetching ? "opacity-60" : ""
            }`}
          >
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </section>
    </>
  );
};

export default Community;
