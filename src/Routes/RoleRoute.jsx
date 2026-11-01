import { Navigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import Loading from "../Components/Loading/Loading";

const RoleRoute = ({ allow, children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) return <Loading />;
  if (!user || !allow.includes(role)) return <Navigate to="/forbidden" replace />;

  return children;
};

export default RoleRoute;
