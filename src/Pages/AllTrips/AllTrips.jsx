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

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-primary">
        All Trips
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg._id} className="card shadow-xl bg-base-100">
            <figure>
              <img
                src={pkg.images?.[0]}
                alt={pkg.title}
                className="h-52 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-xl font-bold">{pkg.title}</h2>
              <p className="text-sm text-gray-600">Location: {pkg.location}</p>
              <p className="text-sm">Type: {pkg.tourType}</p>
              <p className="text-sm font-semibold">Price: ৳{pkg.price}</p>
              <div className="card-actions justify-end mt-4">
                <Link
                  to={`/packages/${pkg._id}`}
                  className="btn btn-primary text-white text-sm px-4"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTrips;
