import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Navbar from "../Common/Navbar";
import Community from "../Pages/Community/Community";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Trips from "../Pages/Trips/Trips";
import Register from "../Pages/Authentication/Register";

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
        path: "/register",
        Component: Register,
      },
    ],
  },
]);

export default router;
