import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Community from "../Pages/Community/Community";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Trips from "../Pages/Trips/Trips";
import Register from "../Pages/Authentication/Register";
import Login from "../Pages/Authentication/Login";
import Home from "../Pages/Home/Home/Home";
import DashboardLayout from "../Layouts/DashboardLayout";
import PrivateRoute from "../Routes/PrivateRoutes";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import ManageProfile from "../Pages/Dashboard/ManageProfile/ManageProfile";

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
        path: "/trips",
        Component: Trips,
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
        Component: DashboardHome,
      },
      {
        path: "/dashboard/manageProfile",
        element: <ManageProfile></ManageProfile>,
      },
    ],
  },
]);

export default router;
