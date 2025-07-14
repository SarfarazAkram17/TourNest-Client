import { useState } from "react";
import { FiX } from "react-icons/fi";

const StoryCard = ({ story }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="border border-black/50 h-full rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-500">
        {/* Cover Image */}
        <img
          src={story.images[0]}
          alt={story.title}
          className="h-48 w-full object-cover"
        />

        <div className="p-4 space-y-2">
          <h3 className="text-xl font-semibold text-primary">{story.title}</h3>

          <p className="text-sm text-gray-500">
            <strong>Uploaded On:</strong>{" "}
            {new Date(story.uploadedAt).toLocaleString("en-BD")}
          </p>

          <p className="text-sm text-gray-500">
            <strong>Location:</strong> {story.location}
          </p>

          <p className="text-sm text-gray-700 line-clamp-2">
            {story.description}
          </p>

          <div className="flex items-center gap-3 mt-3 mb-4">
            <img
              src={story.photo}
              alt={story.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col gap-1 justify-center">
              <span className="text-sm capitalize">
                <strong>Name:</strong> {story.name}
              </span>
              <span className="text-sm capitalize">
                <strong>Role:</strong> {story.role}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-primary font-medium hover:underline text-sm"
            >
              Read Full Story
            </button>
          </div>
          {/* Share buttons (optional later) */}
          {/* 
              <div className="mt-6">
                <FacebookShareButton url={window.location.href} quote={story.title}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
              </div>
              */}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30"></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl relative p-6">
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
              >
                <FiX size={24} />
              </button>

              {/* Title & Location */}
              <h2 className="text-2xl font-bold text-center text-primary mb-1">
                {story.title}
              </h2>
              <p className="text-center text-gray-600 mb-4">
                <strong>Location:</strong> {story.location}
              </p>
              <p className="text-center text-gray-600 mb-4">
                <strong>Uploaded On:</strong>{" "}
                {new Date(story.uploadedAt).toLocaleString("en-BD")}
              </p>

              {/* Zigzag Image Gallery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {story.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`story-img-${i}`}
                    className="w-full object-cover rounded-lg shadow"
                  />
                ))}
              </div>

              {/* Full Description */}
              <p className="text-gray-800 text-sm md:text-base whitespace-pre-line">
                {story.description}
              </p>
              <div className="divider"></div>

              {/* Author Info */}
              <div className="flex items-center gap-3 mt-6">
                <img
                  src={story.photo}
                  alt={story.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col gap-0.5 justify-center">
                  <span className="text-sm capitalize">
                    <strong>Name:</strong> {story.name}
                  </span>
                  <span className="text-sm capitalize">
                    <strong>Role:</strong> {story.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default StoryCard;
