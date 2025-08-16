import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Community from "../Pages/Community/Community";
import AllTrips from "../Pages/AllTrips/AllTrips";
import DashboardLayout from "../Layouts/DashboardLayout";
import PrivateRoute from "../Routes/PrivateRoutes";
import ManageProfile from "../Pages/Dashboard/ManageProfile/ManageProfile";
import AddPackage from "../Pages/Dashboard/AddPackage/AddPackage";
import ManageUsers from "../Pages/Dashboard/ManageUsers/ManageUsers";
import ManageCandidates from "../Pages/Dashboard/ManageCandidates/ManageCandidates";
import JoinAsTourGuide from "../Pages/Dashboard/JoinAsTourGuide/JoinAsTourGuide";
import AdminRoute from "../Routes/AdminRoute";
import TouristRoute from "../Routes/TouristRoute";
import TourGuideRoute from "../Routes/TourGuideRoute";
import PackageDetails from "../Pages/PackageDetails/PackageDetails";
import MyBookings from "../Pages/Dashboard/MyBookings/MyBookings";
import Payment from "../Pages/Dashboard/Payment/Payment";
import MyAssignedTours from "../Pages/Dashboard/MyAssignedTours/MyAssignedTours";
import TourGuideProfile from "../Pages/TourGuideProfile/TourGuideProfile";
import AddStories from "../Pages/Dashboard/AddStories/AddStories";
import ManageStories from "../Pages/Dashboard/ManageStories/ManageStories";
import EditStories from "../Pages/Dashboard/EditStories/EditStories";
import ManageGuideProfile from "../Pages/Dashboard/ManageGuideProfile/ManageGuideProfile";
import StoryDetails from "../Pages/StoryDetails/StoryDetails";
import { lazy, Suspense } from "react";
import Loading from "../Components/Loading/Loading";
import Dashboard from "../Pages/Dashboard/Dashboard/Dashboard";

const Home = lazy(() => import("../Pages/Home/Home/Home"));
const AboutUs = lazy(() => import("../Pages/AboutUs/AboutUs"));
const Login = lazy(() => import("../Pages/Authentication/Login"));
const Register = lazy(() => import("../Pages/Authentication/Register"));
const ErrorPage = lazy(() => import("../Pages/ErrorPage/ErrorPage"));
const Forbidden = lazy(() => import("../Pages/Forbidden/Forbidden"));

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading></Loading>}>
            <Home></Home>
          </Suspense>
        ),
      },
      {
        path: "/community",
        Component: Community,
      },
      {
        path: "/aboutUs",
        element: (
          <Suspense fallback={<Loading></Loading>}>
            <AboutUs></AboutUs>
          </Suspense>
        ),
      },
      {
        path: "/allTrips",
        Component: AllTrips,
      },
      {
        path: "/packages/:id",
        Component: PackageDetails,
      },
      {
        path: "/tourGuide/:id",
        Component: TourGuideProfile,
      },
      {
        path: "/stories/:id",
        Component: StoryDetails,
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<Loading></Loading>}>
            <Login></Login>
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<Loading></Loading>}>
            <Register></Register>
          </Suspense>
        ),
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
        Component: Dashboard,
      },
      {
        path: "manageProfile",
        Component: ManageProfile,
      },
      {
        path: "addStories",
        Component: AddStories,
      },
      {
        path: "manageStories",
        Component: ManageStories,
      },
      {
        path: "editStories/:storyId",
        Component: EditStories,
      },
      {
        path: "myBookings",
        Component: MyBookings,
      },
      {
        path: "payment/:bookingId",
        Component: Payment,
      },
      {
        path: "addPackage",
        element: (
          <AdminRoute>
            <AddPackage></AddPackage>
          </AdminRoute>
        ),
      },
      {
        path: "manageUsers",
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
      },
      {
        path: "manageCandidates",
        element: (
          <AdminRoute>
            <ManageCandidates></ManageCandidates>
          </AdminRoute>
        ),
      },
      {
        path: "joinAsTourGuide",
        element: (
          <TouristRoute>
            <JoinAsTourGuide></JoinAsTourGuide>
          </TouristRoute>
        ),
      },
      {
        path: "manageGuideProfile",
        element: (
          <TourGuideRoute>
            <ManageGuideProfile></ManageGuideProfile>
          </TourGuideRoute>
        ),
      },
      {
        path: "myAssignedTours",
        element: (
          <TourGuideRoute>
            <MyAssignedTours></MyAssignedTours>
          </TourGuideRoute>
        ),
      },
    ],
  },
  {
    path: "/forbidden",
    element: (
      <Suspense fallback={<Loading></Loading>}>
        <Forbidden></Forbidden>
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loading></Loading>}>
        <ErrorPage></ErrorPage>
      </Suspense>
    ),
  },
]);

export default router;
