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
import { MdBookmarkAdded } from "react-icons/md";
import { FaIdBadge, FaUserTie } from "react-icons/fa";
import Footer from "../Components/Common/Footer";
import useUserRole from "../Hooks/useUserRole";
import useAuth from "../Hooks/useAuth";

const DashboardLayout = () => {
  const { user } = useAuth();
  const { role, roleLoading } = useUserRole();
  return (
    <div className="max-w-6xl mx-auto drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col overflow-y-auto">
        {/* Mobile Navbar */}
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
          <div className="mx-2 font-bold px-2 flex gap-2 items-center">
            <img
              src={user?.photoURL}
              alt={user?.displayName}
              className="h-14 w-14 object-cover rounded-full"
            />
            <span>{user?.displayName} Dashboard</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="mt-12 mb-16">
          <Outlet />
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40 lg:fixed lg:top-0 lg:left-0 lg:h-screen">
        <label htmlFor="my-drawer-2" className="drawer-overlay lg:hidden"></label>

        {/* ✅ Keep sidebar scrollable and single-column */}
        <ul className="menu bg-base-200 text-base-content w-60 p-4 h-full overflow-y-auto flex flex-col flex-nowrap hide-scrollbar">
          {/* Logo */}
          <Link to="/">
            <img
              src={logo}
              className="h-13 w-auto mb-4"
              alt="TourNest Logo"
            />
          </Link>

          {/* Navigation Links */}
          <li className="my-1">
            <NavLink to="/dashboard" end>
              <FiUser /> Manage Profile
            </NavLink>
          </li>

          {!roleLoading && role === "tour guide" && (
            <li className="my-1">
              <NavLink to="/dashboard/manageGuideProfile">
                <FaIdBadge /> Manage Guide Profile
              </NavLink>
            </li>
          )}

          <li className="my-1">
            <NavLink to="/dashboard/myBookings">
              <MdBookmarkAdded size={18} /> My Bookings
            </NavLink>
          </li>

          {!roleLoading && role === "tour guide" && (
            <li className="my-1">
              <NavLink to="/dashboard/myAssignedTours">
                <FiBarChart2 size={17} /> My Assigned Tours
              </NavLink>
            </li>
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
            <li className="my-1">
              <NavLink to="/dashboard/joinAsTourGuide">
                <FaUserTie /> Join as Tour Guide
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
