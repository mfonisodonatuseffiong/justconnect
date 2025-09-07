/**
 * @desc This is the navbar for all pages of the application
 *      - Exported to the main app file to display across all routes
 * @returns Navbar with logo, nav links, and sign-in button
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  /** Nav links list */
  const navlinks = [
    { title: "Services", link: "/services", label: "Services page" },
    { title: "About", link: "/about-us", label: "About page" },
    { title: "FAQ", link: "/faqs", label: "Frequently asked questions page" },
    { title: "Contact", link: "/contact-us", label: "Contact us page" },
  ];

  /** Toggle mobile menu visibility */
  const toggleVisibility = () => setMobileMenu((prev) => !prev);

  return (
    <nav
      className={`navbar fixed top-0 h-24 w-full bg-gradient font-medium shadow z-50`}
      aria-label="navbar"
    >
      <div className="relative max-w-7xl h-full mx-auto px-4 flex items-center justify-between">
        {/* LOGO */}
        <div className="logo-container">
          <Link to="/" aria-label="App logo, clicks and takes you home">
            <h2 className="text-xl font-regular sm:text-2xl md:text-3xl uppercase hover:-translate-y-1.5 transition-all duration-500">
              <span className="text-[var(--accent)]">J</span>ustConnect
            </h2>
          </Link>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 items-center">
          {navlinks.map((list, idx) => (
            <li
              key={idx}
              aria-label={list.label}
              className="relative font-semibol"
            >
              <Link
                to={list.link}
                className="group py-2 hover:text-[var(--accent)] transition-all duration-500"
              >
                {list.title}
                {/* underline hover effect */}
                <span className="absolute bottom-[-8px] left-0 h-1 w-0 opacity-0 transition duration-500 bg-[var(--accent)] group-hover:w-full group-hover:opacity-100"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Sign-in Button */}
        <div className="hidden md:flex">
          <Link
            to="/auth/login"
            className="px-8 py-3 rounded-full font-semibold shadow hover:bg-white bg-[var(--accent)] hover:text-[var(--accent)] transition duration-500"
          >
            Sign in
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            type="button"
            aria-label="toggle navigation menu"
            onClick={toggleVisibility}
          >
            {mobileMenu ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Mobile Nav Links */}
        {mobileMenu && (
          <div className="absolute top-full left-0 w-full pb-15 bg-gradient backdrop-blur-md md:hidden">
            <ul className="flex flex-col px-4 space-y-8 py-6">
              {navlinks.map((list, idx) => (
                <li key={idx} aria-label={list.label}>
                  <Link
                    to={list.link}
                    onClick={() => setMobileMenu(false)}
                    className="block text-lg hover:bg-[var(--accent)] transition"
                  >
                    {list.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenu(false)}
                  className="py-3 text-[var(--accent)] hover:scale-105 transition duration-500"
                >
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
