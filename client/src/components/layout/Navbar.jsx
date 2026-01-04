/**
 * @desc Main Navbar for the entire application
 *      - Fixed at top, responsive, clean & modern
 */

import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useAuthHook } from "../../hooks/authHooks";

const Navbar = () => {
  const isAuthenticated = useAuthStore((state) => !!state.user);
  const { auth } = useAuthHook();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { title: "Explore", link: "/explore-services" },
    { title: "About", link: "/about-us" },
    { title: "FAQ", link: "/faqs" },
    { title: "Contact", link: "/contact-us" },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    try {
      const res = await auth.logout();
      toast.success(res.message || "Logged out successfully!");
      // Redirect to hero section (main page)
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Logout failed. Please try again.");
    }
  };

  return (
    <>
      <header
        className="
          fixed top-0 left-0 right-0 z-50
          h-16
          bg-white/90 backdrop-blur-md
          border-b border-orange-200
          shadow-sm
        "
      >
        <nav className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo-white-bg.png"
              alt="JustConnect"
              className="h-10 w-auto object-contain hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <li key={item.link}>
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    `relative text-slate-700 font-medium transition-colors duration-300
                    ${isActive ? "text-orange-600" : "hover:text-orange-600"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.title}
                      <span
                        className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full transition-all duration-500
                        ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop Auth Button */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="
                  inline-flex items-center gap-2 px-6 py-2.5
                  rounded-full font-semibold text-white
                  bg-gradient-to-r from-orange-500 to-rose-500
                  shadow-md hover:shadow-lg
                  hover:scale-105 transition-all duration-300
                "
              >
                Log out
                <LogIn size={18} />
              </button>
            ) : (
              <Link
                to="/auth/login"
                className="
                  inline-flex items-center gap-2 px-6 py-2.5
                  rounded-full font-semibold text-white
                  bg-gradient-to-r from-orange-500 to-rose-500
                  shadow-md hover:shadow-lg
                  hover:scale-105 transition-all duration-300
                "
              >
                Sign in
                <ChevronRight size={18} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-orange-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-orange-200 shadow-xl md:hidden">
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((item) => (
                <NavLink
                  key={item.link}
                  to={item.link}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block text-lg font-medium py-3 px-4 rounded-xl transition-all
                    ${isActive 
                      ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md" 
                      : "text-slate-700 hover:bg-orange-100 hover:text-orange-600"}`
                  }
                >
                  {item.title}
                </NavLink>
              ))}

              <div className="pt-6 border-t border-orange-100">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="
                      w-full py-4 rounded-xl font-semibold text-white
                      bg-gradient-to-r from-orange-500 to-rose-500
                      shadow-lg hover:shadow-xl transition-all
                    "
                  >
                    Log out
                  </button>
                ) : (
                  <Link
                    to="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="
                      block w-full text-center py-4 rounded-xl font-semibold text-white
                      bg-gradient-to-r from-orange-500 to-rose-500
                      shadow-lg hover:shadow-xl transition-all
                    "
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* IMPORTANT: Add this padding to your main content pages! */}
      {/* In your HomePage.jsx, About.jsx, etc., wrap content with: */}
      {/* <div className="pt-16"> ...your content... </div> */}
    </>
  );
};

export default Navbar;
