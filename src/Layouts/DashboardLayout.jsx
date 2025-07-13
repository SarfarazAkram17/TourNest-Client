import { Link, NavLink, Outlet } from "react-router";
import logo from "../assets/logo.png";
import {
  FiUser,
  FiUsers,
  FiPackage,
  FiClipboard,
  FiBookOpen,
  FiFolderPlus,
  FiBarChart2,
} from "react-icons/fi";
import Footer from "../Components/Common/Footer";
import useUserRole from "../Hooks/useUserRole";
import { MdBookmarkAdded } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 font-bold px-2">Dashboard</div>
        </div>

        <div className="mt-12 mb-16">
          <Outlet></Outlet>
        </div>
        <Footer></Footer>
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-60 p-4">
          {/* Sidebar content */}
          <Link to="/">
            <img
              src={logo}
              className="h-16 w-auto mx-auto mb-4"
              alt="TourNest Logo"
            />
          </Link>

          <li className="my-1">
            <NavLink to="/dashboard" end>
              <FiUser /> Manage Profile
            </NavLink>
          </li>

          <li className="my-1">
            <NavLink to="/dashboard/myBookings">
              <MdBookmarkAdded size={18} /> My Bookings
            </NavLink>
          </li>

          {!roleLoading && role === "tour guide" && (
            <>
              <li className="my-1">
                <NavLink to="/dashboard/myAssignedTours">
                  <FiBarChart2 size={17} /> My Assigned Tours
                </NavLink>
              </li>
            </>
          )}

          {!roleLoading && role === "admin" && (
            <>
              <li className="my-1">
                <NavLink to="/dashboard/addPackage">
                  <FiFolderPlus /> Add Package
                </NavLink>
              </li>

              <li className="my-1">
                <NavLink to="/dashboard/manageUsers">
                  <FiUsers /> Manage Users
                </NavLink>
              </li>

              <li className="my-1">
                <NavLink to="/dashboard/manageCandidates">
                  <FiClipboard /> Manage Candidates
                </NavLink>
              </li>
            </>
          )}

          <li className="my-1">
            <NavLink to="/dashboard/addStories">
              <FiPackage /> Add Stories
            </NavLink>
          </li>

          <li className="my-1">
            <NavLink to="/dashboard/manageStories">
              <FiBookOpen /> Manage Stories
            </NavLink>
          </li>

          {!roleLoading && role === "tourist" && (
            <>
              <li className="my-1">
                <NavLink to="/dashboard/joinAsTourGuide">
                  <FaUserTie /> Join as tour guide
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
