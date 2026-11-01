import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading/Loading";

/** Requires a signed-in user. A Firebase session without an API token is signed out. */
const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { user, loading, token, logOutUser } = useAuth();

  useEffect(() => {
    if (!loading && user && !token) logOutUser();
  }, [loading, user, token, logOutUser]);

  if (loading) return <Loading className="min-h-screen" />;

  if (!user) return <Navigate state={location.pathname} to="/login" replace />;

  return children;
};

export default PrivateRoute;
