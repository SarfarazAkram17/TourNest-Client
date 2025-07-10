import axios from "axios";
// import useAuth from "./useAuth";
// import { toast } from "react-toastify";
import { useEffect } from "react";
import { toast } from "react-toastify";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
//   const { logOutUser } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        toast.error(status)

        // if (status === 401 || status === 403) {
        //   toast.error("Session expired or unauthorized. Logging out.");
        //   try {
        //     await logOutUser();
        //   } catch (e) {
        //     console.error("Logout failed", e);
        //   } finally {
        //     Optional: window.location.href = "/login";
        //   }
        // }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, []);
// logOutUser 
  return axiosSecure;
};

export default useAxiosSecure;
