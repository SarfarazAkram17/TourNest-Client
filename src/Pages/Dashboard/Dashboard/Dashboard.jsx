import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import useUserRole from "../../../Hooks/useUserRole";
import { DashboardSkeleton } from "../../../Components/UI/Skeletons";
import Forbidden from "../../Forbidden/Forbidden";
import AdminDashboard from "./Admin/AdminDashboard";
import TourGuideDashboard from "./TourGuide/TourGuideDashboard";
import TouristDashboard from "./Tourist/TouristDashboard";

const Dashboard = () => {
  useDocumentTitle("Dashboard");
  const { role, roleLoading } = useUserRole();

  if (roleLoading) return <DashboardSkeleton />;
  if (role === "admin") return <AdminDashboard />;
  if (role === "tourist") return <TouristDashboard />;
  if (role === "tour guide") return <TourGuideDashboard />;
  return <Forbidden embedded />;
};

export default Dashboard;
