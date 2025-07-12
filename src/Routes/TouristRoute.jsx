import React from "react";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import { Navigate } from "react-router";
import Loading from "../Components/Loading/Loading";

const TouristRoute = ({children}) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <Loading></Loading>;
  }

  if (!user || role !== "tourist") {
    return <Navigate to="/forbidden"></Navigate>;
  }

  return children;
};

export default TouristRoute;