import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const REFRESH = 30 * 1000;

const useStats = (key, path, enabled) => {
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();

  return useQuery({
    queryKey: [key, userEmail],
    queryFn: async () => (await axiosSecure.get(`${path}?email=${userEmail}`)).data,
    enabled: !!userEmail && enabled,
    refetchInterval: REFRESH,
    staleTime: 15 * 1000,
  });
};

export const useAdminStats = (enabled = true) => useStats("adminStats", "/admin/stats", enabled);
export const useTouristStats = (enabled = true) => useStats("touristStats", "/tourist/stats", enabled);
export const useGuideStats = (enabled = true) => useStats("tourGuideStats", "/tourGuide/stats", enabled);
