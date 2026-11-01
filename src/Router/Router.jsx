import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import DashboardLayout from "../Layouts/DashboardLayout";
import PrivateRoute from "../Routes/PrivateRoutes";
import AdminRoute from "../Routes/AdminRoute";
import TouristRoute from "../Routes/TouristRoute";
import TourGuideRoute from "../Routes/TourGuideRoute";
import Loading from "../Components/Loading/Loading";

// Every page is code-split so visitors only download what they open.
const Home = lazy(() => import("../Pages/Home/Home/Home"));
const AllTrips = lazy(() => import("../Pages/AllTrips/AllTrips"));
const Community = lazy(() => import("../Pages/Community/Community"));
const AboutUs = lazy(() => import("../Pages/AboutUs/AboutUs"));
const PackageDetails = lazy(() => import("../Pages/PackageDetails/PackageDetails"));
const TourGuideProfile = lazy(() => import("../Pages/TourGuideProfile/TourGuideProfile"));
const StoryDetails = lazy(() => import("../Pages/StoryDetails/StoryDetails"));
const Login = lazy(() => import("../Pages/Authentication/Login"));
const Register = lazy(() => import("../Pages/Authentication/Register"));
const ErrorPage = lazy(() => import("../Pages/ErrorPage/ErrorPage"));
const Forbidden = lazy(() => import("../Pages/Forbidden/Forbidden"));

const Dashboard = lazy(() => import("../Pages/Dashboard/Dashboard/Dashboard"));
const ManageProfile = lazy(() => import("../Pages/Dashboard/ManageProfile/ManageProfile"));
const AddStories = lazy(() => import("../Pages/Dashboard/AddStories/AddStories"));
const ManageStories = lazy(() => import("../Pages/Dashboard/ManageStories/ManageStories"));
const EditStories = lazy(() => import("../Pages/Dashboard/EditStories/EditStories"));
const MyBookings = lazy(() => import("../Pages/Dashboard/MyBookings/MyBookings"));
const Payment = lazy(() => import("../Pages/Dashboard/Payment/Payment"));
const AddPackage = lazy(() => import("../Pages/Dashboard/AddPackage/AddPackage"));
const ManagePackages = lazy(() => import("../Pages/Dashboard/ManagePackages/ManagePackages"));
const EditPackage = lazy(() => import("../Pages/Dashboard/EditPackage/EditPackage"));
const ManageUsers = lazy(() => import("../Pages/Dashboard/ManageUsers/ManageUsers"));
const ManageCandidates = lazy(() => import("../Pages/Dashboard/ManageCandidates/ManageCandidates"));
const JoinAsTourGuide = lazy(() => import("../Pages/Dashboard/JoinAsTourGuide/JoinAsTourGuide"));
const ManageGuideProfile = lazy(() => import("../Pages/Dashboard/ManageGuideProfile/ManageGuideProfile"));
const MyAssignedTours = lazy(() => import("../Pages/Dashboard/MyAssignedTours/MyAssignedTours"));

const page = (Page, Guard) => {
  const content = Guard ? (
    <Guard>
      <Page />
    </Guard>
  ) : (
    <Page />
  );
  return <Suspense fallback={<Loading />}>{content}</Suspense>;
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, element: page(Home) },
      { path: "allTrips", element: page(AllTrips) },
      { path: "community", element: page(Community) },
      { path: "aboutUs", element: page(AboutUs) },
      { path: "packages/:id", element: page(PackageDetails) },
      { path: "tourGuide/:id", element: page(TourGuideProfile) },
      { path: "stories/:id", element: page(StoryDetails) },
    ],
  },
  { path: "/login", element: page(Login) },
  { path: "/register", element: page(Register) },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: page(Dashboard) },
      { path: "manageProfile", element: page(ManageProfile) },
      { path: "addStories", element: page(AddStories) },
      { path: "manageStories", element: page(ManageStories) },
      { path: "editStories/:storyId", element: page(EditStories) },
      { path: "myBookings", element: page(MyBookings, TouristRoute) },
      { path: "payment/:bookingId", element: page(Payment, TouristRoute) },
      { path: "addPackage", element: page(AddPackage, AdminRoute) },
      { path: "managePackages", element: page(ManagePackages, AdminRoute) },
      { path: "editPackage/:packageId", element: page(EditPackage, AdminRoute) },
      { path: "manageUsers", element: page(ManageUsers, AdminRoute) },
      { path: "manageCandidates", element: page(ManageCandidates, AdminRoute) },
      { path: "joinAsTourGuide", element: page(JoinAsTourGuide, TouristRoute) },
      { path: "manageGuideProfile", element: page(ManageGuideProfile, TourGuideRoute) },
      { path: "myAssignedTours", element: page(MyAssignedTours, TourGuideRoute) },
    ],
  },
  { path: "/forbidden", element: page(Forbidden) },
  { path: "*", element: page(ErrorPage) },
]);

export default router;
