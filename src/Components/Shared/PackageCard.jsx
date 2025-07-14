import { Link } from "react-router";

const PackageCard = ({ pkg }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="h-52 overflow-hidden rounded-t-xl">
        <img
          src={pkg.images?.[0]}
          alt={pkg.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-4">
        <h3 className="text-xl font-semibold">{pkg.title}</h3>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Location:</span> {pkg.location}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Type:</span> {pkg.tourType}
        </p>
        <p className="text-sm text-gray-700 font-semibold">
          ৳{pkg.price.toLocaleString("en-BD")}
        </p>
        <Link to={`/packages/${pkg._id}`}>
          <button className="btn btn-sm btn-primary text-white w-full">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PackageCard;
