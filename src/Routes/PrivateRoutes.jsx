import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
// import Loading from "../Components/Loading/Loading";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
    //   <Loading></Loading>
    <p>loading</p>
    );
  }

  if (!user) {
    return <Navigate state={location.pathname} to="/login"></Navigate>;
  }

  return children;
};

export default PrivateRoute;
