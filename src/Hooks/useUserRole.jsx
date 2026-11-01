import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxios from "./useAxios";

const useUserRole = () => {
  const { loading: authLoading, userEmail } = useAuth();
  const axiosInstance = useAxios();

  const {
    data: role = "user",
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    queryKey: ["userRole", userEmail],
    enabled: !authLoading && !!userEmail,
    staleTime: 60 * 1000,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/users/${encodeURIComponent(userEmail)}/role`
      );
      return res.data.role;
    },
  });

  return {
    role,
    roleLoading: authLoading || (!!userEmail && roleLoading),
    refetch,
  };
};

export default useUserRole;
