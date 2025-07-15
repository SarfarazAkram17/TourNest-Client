import { Link, useNavigate } from "react-router";
import { FacebookShareButton, FacebookIcon } from "react-share";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";

const StoryCard = ({ story }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const shareUrl = `https://tournest-sarfaraz-akram.netlify.app/stories/${story._id}`;
  const quote = `Sarfaraz Akram shared a link.\n\n💬 Check out this amazing travel story: ${story.title}\n\n🌐 see the story: ${shareUrl}`;

  const handleLoginRedirect = () => {
    navigate("/login");
    toast.info("Please login to share this story!");
  };

  return (
    <div className="border border-black/50 rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-500 flex flex-col">
      {/* Cover Image */}
      <img
        src={story.images[0]}
        alt={story.title}
        className="h-48 w-full object-cover"
      />

      {/* Story Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-primary">{story.title}</h3>

        <p className="text-sm text-gray-500 mt-1 mb-3 line-clamp-2">
          {story.description}
        </p>

        <div className="flex items-center gap-3 mb-4">
          <img
            src={story.photo}
            alt={story.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1 justify-center">
            <span className="text-sm capitalize">
              <strong>Name:</strong> {story.name}
            </span>
            <span className="text-sm capitalize">
              <strong>Role:</strong> {story.role}
            </span>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="mt-auto flex justify-between items-center">
          <Link
            to={`/stories/${story._id}`}
            className="text-primary font-medium hover:underline text-sm"
          >
            Read Full Story
          </Link>

          {user ? (
            <FacebookShareButton
              url={shareUrl}
              quote={quote}
            >
              <FacebookIcon size={28} round />
            </FacebookShareButton>
          ) : (
            <button onClick={handleLoginRedirect}>
              <FacebookIcon size={32} round />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
