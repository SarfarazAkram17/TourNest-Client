import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import Loading from "../../../../Components/Loading/Loading";
import useAxios from "../../../../Hooks/useAxios";

const OurPackagesTab = () => {
  const axiosInstance = useAxios();

  const { data: packages, isLoading } = useQuery({
    queryKey: ["randomPackages"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/random-packages`);
      return res.data;
    },
    keepPreviousData: true,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
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
  );
};

export default OurPackagesTab;
