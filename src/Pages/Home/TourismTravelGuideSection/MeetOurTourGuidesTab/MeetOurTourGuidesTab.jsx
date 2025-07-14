import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import Loading from "../../../../Components/Loading/Loading";
import TourGuideCard from "../../../../Components/Shared/TourGuideCard";

const MeetOurTourGuidesTab = () => {
  const axiosInstance = useAxios();

  const { data: guides, isLoading } = useQuery({
    queryKey: ["randomTourGuides"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/random-tour-guides`);
      return res.data;
    },
    keepPreviousData: true,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6">
      {guides.map((guide) => (
        <TourGuideCard key={guide._id} guide={guide} />
      ))}
    </div>
  );
};

export default MeetOurTourGuidesTab;
