import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FacebookIcon, FacebookShareButton } from "react-share";
import { toast } from "react-toastify";
import { LuArrowLeft, LuCalendar, LuMapPin } from "react-icons/lu";
import useAxios from "../../Hooks/useAxios";
import useAuth from "../../Hooks/useAuth";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import Loading from "../../Components/Loading/Loading";
import Avatar from "../../Components/UI/Avatar";
import EmptyState from "../../Components/UI/EmptyState";
import { formatDate } from "../../utils/format";

const StoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosInstance = useAxios();

  const { data: story, isLoading, isError } = useQuery({
    queryKey: ["story", id],
    queryFn: async () => (await axiosInstance.get(`/stories/${id}`)).data,
    enabled: !!id,
    retry: false,
  });

  useDocumentTitle(story?.title || "Story");

  if (isLoading) return <Loading label="Loading story" />;
  if (isError || !story) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Story not found" description="It may have been removed by its author.">
          <Link to="/community" className="btn btn-primary">
            Back to community
          </Link>
        </EmptyState>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/stories/${id}`;
  const quote = `Read this travel story on TourNest: ${story.title}`;
  const [cover, ...rest] = story.images || [];

  const handleLoginRedirect = () => {
    toast.info("Log in to share this story.");
    navigate("/login", { state: `/stories/${id}` });
  };

  return (
    <article className="container-page py-8 md:py-12">
      <Link to="/community" className="btn btn-ghost btn-sm -ml-3 mb-4">
        <LuArrowLeft size={16} aria-hidden="true" /> All stories
      </Link>

      <header className="max-w-3xl">
        <h1 className="h-section">{story.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <LuMapPin size={16} aria-hidden="true" /> {story.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <LuCalendar size={16} aria-hidden="true" /> {formatDate(story.uploadedAt)}
          </span>
        </div>
      </header>

      {cover && (
        <img
          src={cover}
          alt={`${story.title}, cover`}
          className="mt-8 aspect-[16/9] w-full rounded-3xl object-cover shadow-soft"
        />
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <p className="story-body text-base sm:text-lg">{story.description}</p>

          {rest.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {rest.map((img, i) => (
                <img
                  key={img}
                  src={img}
                  alt={`${story.title}, photo ${i + 2}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="surface p-5">
            <p className="text-sm text-muted">Written by</p>
            <div className="mt-3 flex items-center gap-3">
              <Avatar src={story.photo} name={story.name} size="md" />
              <div className="min-w-0">
                <p className="truncate font-bold capitalize">{story.name}</p>
                <p className="text-sm capitalize text-muted">{story.role}</p>
              </div>
            </div>

            <div className="mt-5 border-t border-base-content/10 pt-5">
              {user ? (
                <FacebookShareButton url={shareUrl} quote={quote} className="w-full">
                  <span className="btn btn-outline w-full">
                    <FacebookIcon size={24} round /> Share on Facebook
                  </span>
                </FacebookShareButton>
              ) : (
                <button type="button" onClick={handleLoginRedirect} className="btn btn-outline w-full">
                  <FacebookIcon size={24} round /> Log in to share
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
};

export default StoryDetails;
