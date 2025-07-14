import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import Swal from "sweetalert2";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { FiEdit3, FiTrash2, FiX } from "react-icons/fi";
import useAuth from "../../../Hooks/useAuth";
import useAxios from "../../../Hooks/useAxios";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Components/Loading/Loading";

const ManageStories = () => {
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();
  const [page, setPage] = useState(1);
  const [modalStory, setModalStory] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["my-stories", page, userEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/stories", {
        params: { email: userEmail, page },
      });
      return res.data;
    },
    keepPreviousData: true,
    enabled: !!userEmail,
  });

  const stories = data?.stories || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / data?.limit);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This story will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(
            `/stories/${id}?email=${userEmail}`
          );
          if (res.data.deletedCount) {
            Swal.fire("Deleted!", "The story has been deleted.", "success");
            refetch();
          }
        } catch (error) {
          Swal.fire(error.message, "Failed to delete the story.", "error");
        }
      }
    });
  };

  const handlePageChange = (newPage) => setPage(newPage);

  if (isLoading) return <Loading />;

  return (
    <div className="p-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-10">
        Manage Your Stories
      </h2>

      {stories.length === 0 ? (
        <p className="text-center text-lg text-gray-600">
          No stories shared yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story._id}
                className="border h-full rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-500"
              >
                <img
                  src={story.images?.[0]}
                  alt={story.title}
                  className="w-full h-52 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold text-primary">
                    {story.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    <strong>Uploaded On:</strong>{" "}
                    {new Date(story.uploadedAt).toLocaleString("en-BD")}
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Location:</strong> {story.location}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {story.description}
                  </p>

                  <div className="flex justify-start my-3">
                    <button
                      onClick={() => setModalStory(story)}
                      className="text-primary font-medium hover:underline text-sm"
                    >
                      Read Full Story
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <Link to={`/dashboard/editStories/${story._id}`}>
                        {" "}
                        <button className="btn btn-sm btn-outline btn-primary hover:text-white">
                          <FiEdit3 className="mr-1" /> Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(story._id)}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        <FiTrash2 className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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

      {/* Full Story Modal */}
      {modalStory && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl relative p-6">
              <button
                onClick={() => setModalStory(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
              >
                <FiX size={24} />
              </button>

              <h2 className="text-2xl font-bold text-center text-primary mb-1">
                {modalStory.title}
              </h2>
              <p className="text-center text-gray-600 mb-2">
                <strong>Location:</strong> {modalStory.location}
              </p>
              <p className="text-center text-gray-600 mb-6">
                <strong>Uploaded On:</strong>{" "}
                {new Date(modalStory.uploadedAt).toLocaleString("en-BD")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {modalStory.images?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`story-img-${idx}`}
                    className="w-full object-cover rounded-lg shadow"
                  />
                ))}
              </div>

              <p className="text-gray-800 text-sm md:text-base whitespace-pre-line">
                {modalStory.description}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageStories;
