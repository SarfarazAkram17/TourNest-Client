import React from "react";
import { Link } from "react-router";

const TourGuideCard = ({ guide }) => {
  return (
    <div className="bg-white border border-black/50 shadow-sm rounded-lg py-3 px-6 space-y-2 text-center">
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
      <Link to={`/tourGuide/${guide._id}`}>
        <button className="mt-2 w-full btn btn-outline btn-primary hover:text-white btn-sm">
          View Profile
        </button>
      </Link>
    </div>
  );
};

export default TourGuideCard;
