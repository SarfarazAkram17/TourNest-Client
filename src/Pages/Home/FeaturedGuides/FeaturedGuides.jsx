import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { LuArrowRight } from "react-icons/lu";
import useAxios from "../../../Hooks/useAxios";
import TourGuideCard from "../../../Components/Shared/TourGuideCard";
import SectionHeading from "../../../Components/UI/SectionHeading";
import { CardGridSkeleton } from "../../../Components/UI/Skeletons";

const FeaturedGuides = () => {
  const axiosInstance = useAxios();
  const { data: guides = [], isLoading } = useQuery({
    queryKey: ["randomTourGuides"],
    queryFn: async () => (await axiosInstance.get("/random-tour-guides")).data,
    staleTime: 5 * 60 * 1000,
  });

  if (!isLoading && guides.length === 0) return null;

  return (
    <section id="guides" className="section bg-base-200">
      <div className="container-page">
        <SectionHeading
          title="Meet the people who will show you around"
          description="Every guide is reviewed by our team before they can host a trip."
          action={
            <Link to="/dashboard/joinAsTourGuide" className="btn btn-outline">
              Become a guide <LuArrowRight size={18} aria-hidden="true" />
            </Link>
          }
        />
        {isLoading ? (
          <CardGridSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <TourGuideCard key={guide._id} guide={guide} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedGuides;
