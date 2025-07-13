import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import Loading from "../../Components/Loading/Loading";

const TourGuideProfile = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();

  const { data: tourGuide, isLoading } = useQuery({
    queryKey: ["tourGuide", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/tour-guide/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!tourGuide) {
    return (
      <div className="text-center text-red-500">
        <p>No tour guide found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-10">
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center space-y-4">
        <img
          src={tourGuide.guideInfo.photo}
          alt={tourGuide.guideInfo.name}
          className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-primary shadow-lg"
        />
        <h1 className="text-4xl font-semibold text-primary">
          {tourGuide.guideInfo.name}
        </h1>
        <p className="text-gray-700">
          <span className="font-semibold">Email:</span>{" "}
          {tourGuide.guideInfo.email}
        </p>
        <p className="text-lg text-gray-600 italic">
          {tourGuide.guideInfo.bio}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mt-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="font-semibold">Phone:</span>{" "}
              {tourGuide.guideInfo.phone}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Experience:</span>{" "}
              {tourGuide.guideInfo.experience} years
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Age:</span>{" "}
              {tourGuide.guideInfo.age}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="font-semibold">Region:</span>{" "}
              {tourGuide.guideInfo.region}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">District:</span>{" "}
              {tourGuide.guideInfo.district}
            </p>
            <p className="text-gray-700 capitalize">
              <span className="font-semibold">Languages Spoken:</span>{" "}
              {tourGuide.guideInfo.languages.join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Stories Placeholder (To be implemented later) */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Stories by {tourGuide.guideInfo.name}
        </h2>
        <p className="text-lg text-gray-600">
          Stories will be displayed here once implemented.
        </p>
      </div>
    </div>
  );
};

export default TourGuideProfile;
