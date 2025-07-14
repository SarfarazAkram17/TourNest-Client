import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import Loading from "../../../../Components/Loading/Loading";
import useAxios from "../../../../Hooks/useAxios";
import PackageCard from "../../../../Components/Shared/PackageCard";

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
        <PackageCard key={pkg.id} pkg={pkg}></PackageCard>
      ))}
    </div>
  );
};

export default OurPackagesTab;
