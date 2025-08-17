import Loading from "../../../Components/Loading/Loading";
import useUserRole from "../../../Hooks/useUserRole";
import Forbidden from "../../Forbidden/Forbidden";
import AdminDashboard from "./Admin/AdminDashboard";
import TourGuideDashboard from "./TourGuideDashboard";
import TouristDashboard from "./TouristDashboard";

const Dashboard = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <Loading></Loading>;
  }

  if (role === "admin") {
    return <AdminDashboard></AdminDashboard>;
  } else if (role === "tourist") {
    return <TouristDashboard></TouristDashboard>;
  } else if (role === "tour guide") {
    return <TourGuideDashboard></TourGuideDashboard>;
  } else {
    return <Forbidden></Forbidden>;
  }
};

export default Dashboard;