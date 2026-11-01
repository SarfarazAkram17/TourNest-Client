import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_api_url;

export const axiosPublic = axios.create({ baseURL: API_BASE_URL });

const useAxios = () => axiosPublic;

export default useAxios;
