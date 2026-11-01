import { useState } from "react";
import { Link } from "react-router";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { LuBookOpen, LuMapPin, LuPencil, LuPenLine, LuTrash2 } from "react-icons/lu";
import useAuth from "../../../Hooks/useAuth";
import useAxios from "../../../Hooks/useAxios";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import PageHeader from "../../../Components/UI/PageHeader";
import Pagination from "../../../Components/UI/Pagination";
import EmptyState from "../../../Components/UI/EmptyState";
import Modal from "../../../Components/UI/Modal";
import { CardGridSkeleton } from "../../../Components/UI/Skeletons";
import { confirmAction, getErrorMessage } from "../../../utils/alerts";
import { formatDate } from "../../../utils/format";

const ManageStories = () => {
  useDocumentTitle("My stories");
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { userEmail } = useAuth();
  const [page, setPage] = useState(1);
  const [reading, setReading] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-stories", userEmail, page],
    queryFn: async () => (await axiosInstance.get("/stories", { params: { email: userEmail, page } })).data,
    placeholderData: keepPreviousData,
    enabled: !!userEmail,
  });

  const stories = data?.stories || [];
  const totalPages = Math.ceil((data?.total || 0) / (data?.limit || 12));

  const handleDelete = async (story) => {
    const ok = await confirmAction({
      title: "Delete this story?",
      text: `"${story.title}" will be permanently removed from the Community page.`,
      confirmText: "Delete story",
      icon: "warning",
      danger: true,
    });
    if (!ok) return;

    setDeletingId(story._id);
    try {
      const res = await axiosSecure.delete(`/stories/${story._id}?email=${userEmail}`);
      if (res.data.deletedCount) {
        toast.success("Story deleted.");
        queryClient.invalidateQueries({ queryKey: ["my-stories"] });
        queryClient.invalidateQueries({ queryKey: ["community-stories"] });
        queryClient.invalidateQueries({ queryKey: ["adminStats"] });
        if (stories.length === 1 && page > 1) setPage(page - 1);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "We couldn't delete this story."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="My stories"
        description="Edit, preview or remove the stories you've shared."
        actions={
          <Link to="/dashboard/addStories" className="btn btn-primary">
            <LuPenLine size={16} aria-hidden="true" /> New story
          </Link>
        }
      />

      {isLoading ? (
        <CardGridSkeleton count={3} />
      ) : stories.length === 0 ? (
        <EmptyState
          icon={LuBookOpen}
          title="You haven't shared a story yet"
          description="Your stories appear here once published. Share your first trip memory."
        >
          <Link to="/dashboard/addStories" className="btn btn-primary">
            Write a story
          </Link>
        </EmptyState>
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {stories.map((story) => (
              <li key={story._id} className="surface-flat flex flex-col overflow-hidden">
                <div className="aspect-[16/10] bg-base-200">
                  <img src={story.images?.[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="line-clamp-2 font-bold leading-snug">{story.title}</h2>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
                    <LuMapPin size={13} aria-hidden="true" /> {story.location}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">Published {formatDate(story.uploadedAt)}</p>
                  <p className="mt-3 line-clamp-2 text-sm text-muted">{story.description}</p>

                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setReading(story)}>
                      Read
                    </button>
                    <Link to={`/dashboard/editStories/${story._id}`} className="btn btn-outline btn-sm">
                      <LuPencil size={14} aria-hidden="true" /> Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm ml-auto text-error"
                      disabled={deletingId === story._id}
                      onClick={() => handleDelete(story)}
                      aria-label={`Delete ${story.title}`}
                    >
                      <LuTrash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      <Modal open={!!reading} onClose={() => setReading(null)} title={reading?.title} description={reading?.location} size="lg">
        {reading && (
          <div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {reading.images?.map((img, i) => (
                <img key={img} src={img} alt={`Story photo ${i + 1}`} loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover" />
              ))}
            </div>
            <p className="story-body mt-5">{reading.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageStories;
