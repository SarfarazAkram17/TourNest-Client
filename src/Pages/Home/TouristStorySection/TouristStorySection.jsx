import { useNavigate } from "react-router";
// import { FacebookIcon, FacebookShareButton } from "react-share";
import StoryCard from "../../../Components/Shared/StoryCard";
import Loading from "../../../Components/Loading/Loading";
import useAxios from "../../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

const TouristStorySection = () => {
  //   const { user } = useAuthContext();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const { data: stories, isLoading } = useQuery({
    queryKey: ["random-stories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/random-stories");
      return res.data;
    },
    keepPreviousData: true,
  });

  //   const handleShare = (storyId) => {
  //     if (!user) {
  //       navigate("/login");
  //     }
  //   };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-primary mb-6">
          Tourist Stories
        </h2>
        <p className="text-center text-sm max-w-3xl mx-auto text-gray-600 mb-10">
          Discover inspiring stories shared by travelers from around the world.
          Read their experiences, see their photos, and get inspired for your
          next adventure!
        </p>

        {isLoading ? (
          <Loading></Loading>
        ) : stories.length === 0 ? (
          <p className="text-center text-gray-500">No stories found.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/community")}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            View All Stories
          </button>
        </div>
      </div>
    </section>
  );
};

export default TouristStorySection;