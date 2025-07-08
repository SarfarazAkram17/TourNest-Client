import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Navbar from "../Common/Navbar";

const router = createBrowserRouter([
{
    path: '/',
    Component: RootLayout,
    children: [
        {
            index: true,
            Component: Home
        },
    ]
}
])

export default router;