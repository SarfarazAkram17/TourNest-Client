import { Link, NavLink } from "react-router";
import logo from "../assets/logo.png";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { RiMenu2Line } from "react-icons/ri";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        to="/trips"
      >
        Trips
      </NavLink>
    </>
  );

  return (
    <div className="navbar bg-base-100 p-3 shadow-sm relative">
      <div className="navbar-start">
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="btn btn-ghost">
            {isOpen ? <RxCross2 size={20} /> : <RiMenu2Line size={20} />}
          </button>
        </div>

        <Link to="/" className="btn btn-ghost text-xl">
          <img src={logo} alt="TourNest Logo" className="h-12 w-auto" />
        </Link>
      </div>

      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>

      <div className="navbar-end">
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
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full w-40 -mt-2 left-4 z-10 md:hidden bg-base-100 rounded-box p-2 place-items-center shadow">
          <ul className="menu space-y-2 text-center">
            {navLinks}
            <Link to="/register" onClick={() => setIsOpen(false)}>
              <button className="btn bg-transparent w-full text-primary border-2 border-primary hover:bg-primary hover:text-white">
                Register
              </button>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
