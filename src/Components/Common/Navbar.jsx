import { Link, NavLink } from "react-router";
import logo from "../../assets/logo.png";
import { RxCross2 } from "react-icons/rx";
import { useState, useRef, useEffect } from "react";
import { RiMenu2Line } from "react-icons/ri";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, userEmail, logOutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = (
    <>
      <NavLink
        onClick={() => setIsOpen(false)}
        className="px-4 py-1 font-semibold rounded-full text-sm"
        to="/"
      >
        Home
      </NavLink>
      <NavLink
        onClick={() => setIsOpen(false)}
        className="px-4 py-1 font-semibold rounded-full text-sm"
        to="/community"
      >
        Community
      </NavLink>
      <NavLink
        onClick={() => setIsOpen(false)}
        className="px-4 py-1 font-semibold rounded-full text-sm"
        to="/aboutUs"
      >
        About Us
      </NavLink>
      <NavLink
        onClick={() => setIsOpen(false)}
        className="px-4 py-1 font-semibold rounded-full text-sm"
        to="/allTrips"
      >
        All Trips
      </NavLink>
    </>
  );

  const handleLogout = () => {
    logOutUser()
      .then(() => {
        toast.warn("You Logout from TourNest");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar bg-base-100 p-3 shadow-sm relative">
      <div className="navbar-start">
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="btn btn-ghost">
            {isOpen ? <RxCross2 size={20} /> : <RiMenu2Line size={20} />}
          </button>
        </div>

        <Link to="/" className="ml-2">
          <img src={logo} alt="TourNest Logo" className="h-10 sm:h-12 w-auto" />
        </Link>
      </div>

      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>

      <div className="navbar-end">
        {user ? (
          <>
            <div className="dropdown dropdown-bottom dropdown-end">
              <div tabIndex={0} role="button">
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="rounded-full w-11 mr-2 h-11 cursor-pointer"
                />
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 w-56 rounded-box z-10 mt-1 space-y-2 text-center shadow"
              >
                <li className="text-xs">Hi, {user.displayName}</li>
                <li className="text-xs">{userEmail}</li>
                <NavLink
                  className="px-4 py-1 font-semibold rounded-full text-sm"
                  to="/dashboard"
                >
                  Dashboard
                </NavLink>
              </ul>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-sm hidden md:block font-bold btn-error mr-2"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="btn bg-primary text-white border-2 border-primary hover:bg-transparent hover:text-primary mr-2">
                Login
              </button>
            </Link>
            <Link to="/register" className="hidden md:inline">
              <button className="btn bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white">
                Register
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full w-40 -mt-2 left-4 z-10 md:hidden bg-base-100 rounded-box p-2 place-items-center shadow"
        >
          <ul className="menu space-y-2 text-center">
            {navLinks}
            {user ? (
              <button onClick={handleLogout} className="btn btn-error btn-sm">
                Logout
              </button>
            ) : (
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <button className="btn bg-transparent w-full text-primary border-2 border-primary hover:bg-primary hover:text-white">
                  Register
                </button>
              </Link>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
