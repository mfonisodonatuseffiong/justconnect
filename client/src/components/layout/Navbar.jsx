/**
 * @desc This is the navbar for all pages of the application
 *      - Exported to the main app file to display across all routes
 * @returns Navbar with logo, nav links, and sign-in button
 */

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  /** Nav links list */
  const navlinks = [
    { title: "Services", link: "/services", label: "Services page" },
    { title: "About", link: "/about-us", label: "About page" },
    { title: "Faq", link: "/faqs", label: "Frequently asked questions page" },
    { title: "Contact", link: "/contact-us", label: "Contact us page" },
  ];

  /** Toggle mobile menu visibility */
  const toggleVisibility = () => setMobileMenu((prev) => !prev);

  return (
    <header
      className={`navbar fixed top-0 h-24 w-full bg-gradient font-medium shadow z-50`}
      aria-label="navbar"
    >
      <nav className="relative max-w-7xl h-full mx-auto px-4 flex items-center justify-between">
        {/* ------ LOGO --------- */}
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
            <li key={idx} aria-label={list.label} className="relative">
              <NavLink
                to={list.link}
                className={({ isActive }) => {
                  return `
      relative inline-block py-2 transition-all duration-500 group
      ${isActive ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"}
    `;
                }}
              >
                {({ isActive }) => (
                  <>
                    {list.title}
                    {/* underline hover effect */}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-[var(--accent)] rounded-full transition-all duration-500 ${
                        isActive
                          ? "w-full opacity-100"
                          : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Sign-in Button */}
        <div className="hidden md:flex">
          <Link
            to="/auth/login"
            className="px-10 py-2 rounded-full font-semibold shadow hover:bg-white bg-[var(--accent)] hover:text-[var(--accent)] transition duration-500"
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
                  <NavLink
                    to={list.link}
                    onClick={() => setMobileMenu(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-lg rounded-md transition ${
                        isActive
                          ? "bg-[var(--accent)]"
                          : "hover:bg-[var(--accent)] hover:text-white"
                      }`
                    }
                  >
                    {list.title}
                  </NavLink>
                </li>
              ))}
              <li>
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenu(false)}
                  className="block w-full text-center py-3 rounded-md font-medium text-[var(--accent)] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition duration-300"
                >
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
