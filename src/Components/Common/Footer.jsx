import { Link, NavLink } from "react-router";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import logo from "../../assets/logo.png";

const Footer = () => {
  const navLinks = (
    <>
      <li>
        <NavLink
          className="px-4 py-1 font-semibold rounded-full text-sm hover:text-primary"
          to="/"
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          className="px-4 py-1 font-semibold rounded-full text-sm hover:text-primary"
          to="/community"
        >
          Community
        </NavLink>
      </li>
      <li>
        <NavLink
          className="px-4 py-1 font-semibold rounded-full text-sm hover:text-primary"
          to="/aboutUs"
        >
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink
          className="px-4 py-1 font-semibold rounded-full text-sm hover:text-primary"
          to="/allTrips"
        >
         All Trips
        </NavLink>
      </li>
    </>
  );

  return (
    <footer className="bg-base-300 mt-10">
      <div className="px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo + Name */}
        <div className="flex flex-col items-center md:items-start">
          <Link to="/">
            <img src={logo} alt="TourNest Logo" className="h-12 mb-2" />
          </Link>
          <p className="font-bold text-lg">TourNest</p>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Explore Bangladesh with ease
          </p>
        </div>

        {/* Navigation Links */}
        <div className="text-center md:text-left">
          <h3 className="footer-title font-bold">Quick Links</h3>
          <ul className="mt-2 space-y-2">{navLinks}</ul>
        </div>

        {/* Social Media */}
        <div className="text-center md:text-left">
          <h3 className="footer-title font-bold">Developer</h3>
          <p className="mt-2 text-sm text-gray-600 font-semibold">
            Sarfaraz Akram
          </p>
          <div className="flex justify-center md:justify-start gap-3 mt-4">
            <a
              href="https://github.com/SarfarazAkram17"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub size={25} className="hover:text-primary" />
            </a>
            <a
              href="https://www.linkedin.com/in/sarfarazakram"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin size={25} className="hover:text-primary" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t-2 border-black/10 text-sm text-center py-4 font-bold">
        © {new Date().getFullYear()} Tour
        <span className="text-primary">Nest</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
