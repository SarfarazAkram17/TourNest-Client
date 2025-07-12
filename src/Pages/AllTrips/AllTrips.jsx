import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxios from "../../Hooks/useAxios";
import Loading from "../../Components/Loading/Loading";

const AllTrips = () => {
  const axiosInstance = useAxios();

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["all-packages"],
    queryFn: async () => {
      const res = await axiosInstance.get("/packages");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 md:px-6 lg:px-8">
      <h2 className="text-4xl font-bold mb-4 text-center text-primary">
        Explore All Trips
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10 text-sm md:text-base">
        Discover a curated selection of travel experiences across Bangladesh and
        beyond. Whether you're looking for adventure, relaxation, or cultural
        exploration, our tour packages offer something for every kind of
        traveler.
      </p>

      {packages.length === 0 ? (
        <p className="text-center text-gray-500">No packages available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
            >
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
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTrips;
