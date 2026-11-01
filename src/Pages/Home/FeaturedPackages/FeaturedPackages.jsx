import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { LuArrowRight, LuMapPinOff } from "react-icons/lu";
import useAxios from "../../../Hooks/useAxios";
import PackageCard from "../../../Components/Shared/PackageCard";
import SectionHeading from "../../../Components/UI/SectionHeading";
import EmptyState from "../../../Components/UI/EmptyState";
import { CardGridSkeleton } from "../../../Components/UI/Skeletons";

const FeaturedPackages = () => {
  const axiosInstance = useAxios();
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["randomPackages"],
    queryFn: async () => (await axiosInstance.get("/random-packages")).data,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="section">
      <div className="container-page">
        <SectionHeading
          title="Trips travelers are booking"
          description="A fresh selection from our catalogue. Open any trip to see the full day-by-day plan."
          action={
            <Link to="/allTrips" className="btn btn-outline">
              View all trips <LuArrowRight size={18} aria-hidden="true" />
            </Link>
          }
        />
        {isLoading ? (
          <CardGridSkeleton count={3} />
        ) : packages.length === 0 ? (
          <EmptyState
            icon={LuMapPinOff}
            title="No trips yet"
            description="New packages will appear here as soon as they are published."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPackages;
