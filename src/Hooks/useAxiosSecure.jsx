import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";
import { getAccessToken } from "./tokenStore";
import { API_BASE_URL } from "./useAxios";

const axiosSecure = axios.create({ baseURL: API_BASE_URL });

// Interceptors are registered exactly once. React hooks only refresh the
// callbacks they need (logout / navigate), so requests never stack handlers.
let handlers = { logout: () => {}, navigate: () => {} };
let handlingUnauthorized = false;

axiosSecure.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401 && !handlingUnauthorized) {
      handlingUnauthorized = true;
      try {
        await handlers.logout();
      } finally {
        handlingUnauthorized = false;
      }
      handlers.navigate("/login");
    }

    if (status === 403) {
      handlers.navigate("/forbidden");
    }

    return Promise.reject(error);
  }
);

const useAxiosSecure = () => {
  const { logOutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    handlers = { logout: logOutUser, navigate };
  });

  return axiosSecure;
};

export default useAxiosSecure;
