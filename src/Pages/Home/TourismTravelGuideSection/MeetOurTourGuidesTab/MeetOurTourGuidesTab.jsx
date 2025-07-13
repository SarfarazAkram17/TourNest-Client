import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxios from "../../../../Hooks/useAxios";
import Loading from "../../../../Components/Loading/Loading";

const MeetOurTourGuidesTab = () => {
  const navigate = useNavigate();
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
        <div
          key={guide._id}
          className="bg-white border border-black/50 shadow-sm rounded-lg py-3 px-6 space-y-2 text-center"
        >
          <img
            src={guide.guideInfo.photo}
            alt={guide.guideInfo.name}
            className="w-20 h-20 object-cover mx-auto rounded-full mb-2"
          />
          <h3 className="font-semibold text-lg text-primary">
            {guide.guideInfo.name}
          </h3>
          <p className="text-sm text-gray-600">{guide.guideInfo.email}</p>
          <p className="text-sm text-gray-600">
            <strong>Experience:</strong> {guide.guideInfo.experience}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Phone:</strong> {guide.guideInfo.phone}
          </p>
          <button
            onClick={() => navigate(`/tourGuide/${guide._id}`)}
            className="mt-2 w-full btn btn-outline btn-primary hover:text-white btn-sm"
          >
            Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default MeetOurTourGuidesTab;
