import { Link, NavLink } from "react-router";
import logo from "../../assets/logo.png";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useRef, useState } from "react";
import { RiMenu2Line } from "react-icons/ri";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, userEmail, logOutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef()

    useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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

  return (
    <div ref={menuRef} className="navbar sticky z-50 bg-base-100 p-3 shadow-sm top-0">
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
                  className="rounded-full object-cover w-13 mr-2 h-13 cursor-pointer"
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
                <button
                  onClick={handleLogout}
                  className="btn btn-sm font-bold w-[50%] mx-auto btn-error"
                >
                  Logout
                </button>
              </ul>
            </div>
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
          className="absolute top-full w-40 -mt-2 left-4 z-10 md:hidden bg-base-100 rounded-box p-2 place-items-center shadow"
        >
          <ul className="menu space-y-2 text-center">
            {navLinks}
            {!user && (
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
