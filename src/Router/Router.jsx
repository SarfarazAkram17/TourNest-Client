import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Community from "../Pages/Community/Community";
import AboutUs from "../Pages/AboutUs/AboutUs";
import AllTrips from "../Pages/AllTrips/AllTrips";
import Register from "../Pages/Authentication/Register";
import Login from "../Pages/Authentication/Login";
import Home from "../Pages/Home/Home/Home";
import DashboardLayout from "../Layouts/DashboardLayout";
import PrivateRoute from "../Routes/PrivateRoutes";
import ManageProfile from "../Pages/Dashboard/ManageProfile/ManageProfile";
import AddPackage from "../Pages/Dashboard/AddPackage/AddPackage";
import ManageUsers from "../Pages/Dashboard/ManageUsers/ManageUsers";
import ManageCandidates from "../Pages/Dashboard/ManageCandidates/ManageCandidates";
import JoinAsTourGuide from "../Pages/Dashboard/JoinAsTourGuide/JoinAsTourGuide";
import AdminRoute from "../Routes/AdminRoute";
import TouristRoute from "../Routes/TouristRoute";
import Forbidden from "../Pages/Forbidden/Forbidden";
import PakageDetails from "../Pages/PakageDetails/PakageDetails";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/community",
        Component: Community,
      },
      {
        path: "/aboutUs",
        Component: AboutUs,
      },
      {
        path: "/allTrips",
        Component: AllTrips,
      },
      {
        path: "/packages/:id",
        Component: PakageDetails,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: ManageProfile,
      },
      {
        path: "/dashboard/myBookings",
        element: <p>this is my bookings page</p>,
      },
      {
        path: "/dashboard/addPackage",
        element: (
          <AdminRoute>
            <AddPackage></AddPackage>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/manageUsers",
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/manageCandidates",
        element: (
          <AdminRoute>
            <ManageCandidates></ManageCandidates>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/joinAsTourGuide",
        element: (
          <TouristRoute>
            <JoinAsTourGuide></JoinAsTourGuide>
          </TouristRoute>
        ),
      },
    ],
  },
  {
    path: "/forbidden",
    Component: Forbidden,
  },
]);

export default router;
