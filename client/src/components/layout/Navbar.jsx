/**
 * @desc This is the navbar for all pages of the application
 *      - Exported to the main app file to display across all routes
 * @returns Navbar with logo, nav links, and sign-in button
 */

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ChevronRight, LogInIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useAuthHook } from "../../hooks/authHooks";

const Navbar = () => {
  const isAuthenticated = useAuthStore((state) => !!state.user);
  const { auth } = useAuthHook();
  const [mobileMenu, setMobileMenu] = useState(false);

  /** Nav links list */
  const navlinks = [
    { title: "Explore", link: "/explore-services", label: "explore page" },
    { title: "About", link: "/about-us", label: "About page" },
    { title: "Faq", link: "/faqs", label: "Frequently asked questions page" },
    { title: "Contact", link: "/contact-us", label: "Contact us page" },
  ];

  /** Toggle mobile menu visibility */
  const toggleVisibility = () => setMobileMenu((prev) => !prev);

  // Log out function
  const handleLogout = async () => {
    setMobileMenu(false);
    try {
      const res = await auth.logout();
      toast.success(res.message || "Logout successful.");
    } catch (err) {
      toast.error(
        err.message ||
          "Something went wrong while logging out, Please try again.",
      );
    }
  };

  return (
    <header
      className={`navbar fixed top-0 h-24 w-full bg-brand-bg text-primary-gray font-medium shadow z-50`}
      aria-label="navbar"
    >
      <nav className="relative max-w-7xl h-full mx-auto px-4 flex items-center justify-between">
        {/* ------ LOGO --------- */}
        <div className="flex items-center h-full">
          <Link
            to="/"
            aria-label="App logo, clicks and takes you home"
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <img
              title="Home"
              src="/logo-white-bg.png"
              alt="JustConnect Logo"
              className="h-auto w-35 drop-shadow-accent object-cover focus:outline-none focus:ring-white hover:-translate-y-1 duration-300"
            />
          </Link>
        </div>
        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 items-center">
          {navlinks.map((list, idx) => (
            <li key={idx} aria-label={list.label} className="relative">
              <NavLink
                to={list.link}
                className={({ isActive }) => {
                  return `relative inline-block py-2 transition-all duration-500 group ${isActive ? "text-accent" : "hover:text-accent"}`;
                }}
              >
                {({ isActive }) => (
                  <>
                    {list.title}
                    {/* underline hover effect */}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-accent rounded-full transition-all duration-500 ${
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

        {/* ======= Sign-in Button ========*/}
        <div className="hidden md:flex">
          {isAuthenticated ? (
            <button
              aria-label="log out button"
              role="button"
              onClick={handleLogout}
              className="inline-flex gap-3 items-center px-8 py-2 rounded-full font-semibold shadow text-white hover:bg-white bg-accent hover:text-accent transition duration-500"
            >
              Log out
              <LogInIcon size={14} />
            </button>
          ) : (
            <Link
              to="/auth/login"
              className="inline-flex gap-3 items-center px-8 py-2 rounded-full font-semibold shadow text-white hover:bg-white bg-accent hover:text-accent transition duration-500"
            >
              Sign in
              <ChevronRight />
            </Link>
          )}
        </div>

        {/* ============= Mobile Menu Button ====================*/}
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
          <div className="absolute top-full left-0 w-full pb-15 bg-brand-bg backdrop-blur-md md:hidden">
            <ul className="flex flex-col px-4 space-y-8 py-6">
              {navlinks.map((list, idx) => (
                <li key={idx} aria-label={list.label}>
                  <NavLink
                    to={list.link}
                    onClick={() => setMobileMenu(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-lg rounded-md transition ${
                        isActive
                          ? "bg-accent"
                          : "hover:bg-accent hover:text-white"
                      }`
                    }
                  >
                    {list.title}
                  </NavLink>
                </li>
              ))}
              <li>
                {isAuthenticated ? (
                  <button
                    aria-label="log out button"
                    role="button"
                    onClick={handleLogout}
                    className="block w-full text-center py-3 rounded-md font-medium text-accent border border-accent hover:bg-accent hover:text-white transition duration-300"
                  >
                    Log out
                  </button>
                ) : (
                  <Link
                    to="/auth/login"
                    onClick={() => setMobileMenu(false)}
                    className="block w-full text-center py-3 rounded-md font-medium text-accent border border-accent hover:bg-accent hover:text-white transition duration-300"
                  >
                    Sign in
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
