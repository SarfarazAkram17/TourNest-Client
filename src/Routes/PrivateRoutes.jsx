import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading/Loading";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { user, loading, token, tokenLoading, logOutUser } = useAuth();

  useEffect(() => {
    if (!loading && user && !tokenLoading && !token) {
      logOutUser();
    }
  }, [loading, user, tokenLoading, token, logOutUser]);

  if (loading) {
    return <Loading></Loading>;
  }

  if (!user) {
    return <Navigate state={location.pathname} to="/login"></Navigate>;
  }

  return children;
};

export default PrivateRoute;
