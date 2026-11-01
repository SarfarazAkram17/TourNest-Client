import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { LuArrowRight } from "react-icons/lu";
import useAxios from "../../../Hooks/useAxios";
import StoryCard from "../../../Components/Shared/StoryCard";
import SectionHeading from "../../../Components/UI/SectionHeading";
import { CardGridSkeleton } from "../../../Components/UI/Skeletons";

const TouristStorySection = () => {
  const axiosInstance = useAxios();
  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["random-stories"],
    queryFn: async () => (await axiosInstance.get("/random-stories")).data,
    staleTime: 5 * 60 * 1000,
  });

  if (!isLoading && stories.length === 0) return null;

  return (
    <section className="section">
      <div className="container-page">
        <SectionHeading
          title="Stories from the road"
          description="Real experiences from travelers and guides, with photos to get you inspired."
          action={
            <Link to="/community" className="btn btn-outline">
              Read more stories <LuArrowRight size={18} aria-hidden="true" />
            </Link>
          }
        />
        {isLoading ? (
          <CardGridSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TouristStorySection;
