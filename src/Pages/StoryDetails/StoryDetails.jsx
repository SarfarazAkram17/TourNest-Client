import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import useAuth from "../../Hooks/useAuth";
import Loading from "../../Components/Loading/Loading";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { toast } from "react-toastify";

const StoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosInstance = useAxios();

  const { data: story, isLoading } = useQuery({
    queryKey: ["story", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/stories/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <Loading />;

  const shareUrl = `https://tournest-sarfaraz-akram.netlify.app/stories/${id}`;
  const quote = `Sarfaraz Akram shared a link.\n\n💬 Check out this amazing travel story: ${story.title}\n\n🌐 see the story: ${shareUrl}`;

  const handleLoginRedirect = () => {
    navigate("/login");
    toast.info("Please login to share this story!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary text-center mb-2">
        {story.title}
      </h2>
      <p className="text-center text-gray-600 mb-4">
        <strong>Location:</strong> {story.location}
      </p>
      <p className="text-center text-gray-600 mb-8">
        <strong>Uploaded On:</strong>{" "}
        {new Date(story.uploadedAt).toLocaleString("en-BD")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {story.images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`story-img-${i}`}
            className="w-full h-52 rounded-lg shadow"
          />
        ))}
      </div>

      <p className="text-gray-800 text-base whitespace-pre-line mb-6">
        {story.description}
      </p>

      {/* Author + Share */}
      <div className="flex items-center justify-between gap-4 mt-8 border-t pt-6">
        <div className="flex items-center gap-4">
          <img
            src={story.photo}
            alt={story.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="text-sm capitalize">
              <strong>Name:</strong> {story.name}
            </p>
            <p className="text-sm capitalize">
              <strong>Role:</strong> {story.role}
            </p>
          </div>
        </div>

        {user ? (
          <FacebookShareButton
            url={shareUrl}
            quote={quote}
          >
            <div className="flex items-center gap-2 btn btn-outline py-5 btn-sm">
              <FacebookIcon size={28} round />
              <span className="hidden sm:inline">Share on Facebook</span>
            </div>
          </FacebookShareButton>
        ) : (
          <button onClick={handleLoginRedirect}>
            <FacebookIcon size={32} round />
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryDetails;
