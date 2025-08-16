import { useParams } from "react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import Loading from "../../Components/Loading/Loading";
import StoryCard from "../../Components/Shared/StoryCard";
import {
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";

const TourGuideProfile = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();
  const [page, setPage] = useState(1);

  const { data: tourGuide, isLoading: isLoadingGuide } = useQuery({
    queryKey: ["tourGuide", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/tour-guide/${id}`);
      return res.data;
    },
  });

  const { data, isLoading: isLoadingStories } = useQuery({
    queryKey: ["tourGuide-stories", page],
    queryFn: async () => {
      const email = tourGuide?.guideInfo?.email;

      const res = await axiosInstance.get(`/stories`, {
        params: { email, page },
      });
      return res.data;
    },
    keepPreviousData: true,
    enabled: !!tourGuide?.guideInfo?.email,
  });

  const stories = data?.stories || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / data?.limit);

  const handlePageChange = (newPage) => setPage(newPage);

  if (isLoadingGuide || isLoadingStories) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 my-7">
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
              <span className="font-semibold">Languages:</span>{" "}
              {tourGuide.guideInfo.languages.join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Tour Guide Stories Section */}
      <div className="mt-16">
        <h2 className="text-3xl md:text-4xl text-primary text-center font-semibold mb-10">
          Stories Shared by {tourGuide.guideInfo.name}
        </h2>

        {stories.length === 0 ? (
          <p className="text-center text-lg text-gray-700">
            No Stories Shared yet.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <StoryCard key={story._id} story={story} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-2 flex-wrap">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`btn btn-sm ${
                  page === 1
                    ? "btn-disabled text-black/40"
                    : "btn-primary text-white"
                }`}
              >
                <MdOutlineKeyboardDoubleArrowLeft size={20} />
              </button>

              {[...Array(totalPages).keys()].map((n) => (
                <button
                  key={n}
                  onClick={() => handlePageChange(n + 1)}
                  className={`btn btn-sm ${
                    page === n + 1 ? "btn-primary text-white" : "btn-outline"
                  }`}
                >
                  {n + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || totalPages === 0}
                className={`btn btn-sm ${
                  page === totalPages || totalPages === 0
                    ? "btn-disabled text-black/40"
                    : "btn-primary text-white"
                }`}
              >
                <MdKeyboardDoubleArrowRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TourGuideProfile;
