import { Link, useNavigate } from "react-router";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { toast } from "react-toastify";
import { LuMapPin } from "react-icons/lu";
import useAuth from "../../Hooks/useAuth";
import Avatar from "../UI/Avatar";

const StoryCard = ({ story }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const shareUrl = `${window.location.origin}/stories/${story._id}`;
  const quote = `Read this travel story on TourNest: ${story.title}`;

  const handleLoginRedirect = () => {
    toast.info("Log in to share this story.");
    navigate("/login", { state: `/stories/${story._id}` });
  };

  return (
    <article className="group surface-flat relative flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-base-200">
        <img
          src={story.images?.[0]}
          alt={story.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {story.location && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-base-100/90 px-3 py-1 text-xs font-semibold backdrop-blur">
            <LuMapPin size={12} aria-hidden="true" /> {story.location}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug">
          <Link
            to={`/stories/${story._id}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {story.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{story.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar src={story.photo} name={story.name} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold capitalize">{story.name}</p>
              <p className="truncate text-xs capitalize text-muted">{story.role}</p>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            {user ? (
              <FacebookShareButton url={shareUrl} quote={quote} aria-label="Share on Facebook">
                <FacebookIcon size={32} round />
              </FacebookShareButton>
            ) : (
              <button type="button" onClick={handleLoginRedirect} aria-label="Log in to share">
                <FacebookIcon size={32} round />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default StoryCard;
