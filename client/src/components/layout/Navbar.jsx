/**
 * @desc Premium Main Navbar – Industry Standard Design
 *       Smooth scroll to landing page sections (About, FAQ, Services)
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/authStore";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // If section not found (not on landing page), go to home and scroll
      window.location.href = `/#${sectionId}`;
    }
  };

  // Logout handler
  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setMobileMenuOpen(false);
    window.location.href = "/"; // Go to home page
  };

  const navItems = [
    { label: "Explore", action: () => scrollToSection("our-services") },
    { label: "About", action: () => scrollToSection("about") },
    { label: "FAQ", action: () => scrollToSection("faq") },
    { label: "Contact", link: "/contact-us" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-xl border-b border-orange-100 shadow-sm">
        <nav className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center hover:scale-105 transition-transform duration-300"
          >
            <img
              src="/logo-white-bg.png"
              alt="JustConnect"
              className="h-10 w-auto object-contain"
            />
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.link ? (
                  <Link
                    to={item.link}
                    className="text-lg font-medium text-slate-700 hover:text-orange-600 transition-colors duration-300 relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-rose-500 group-hover:w-full transition-all duration-500" />
                  </Link>
                ) : (
                  <button
                    onClick={item.action}
                    className="text-lg font-medium text-slate-700 hover:text-orange-600 transition-colors duration-300 relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-rose-500 group-hover:w-full transition-all duration-500" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop Auth Button */}
          <div className="hidden lg:block">
            {user ? (
              <button
                onClick={handleLogout}
                className="group inline-flex items-center gap-3 px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <LogOut size={20} className="group-hover:translate-x-1 transition" />
                Log Out
              </button>
            ) : (
              <Link
                to="/auth/login"
                className="group inline-flex items-center gap-3 px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <LogIn size={20} className="group-hover:translate-x-1 transition" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-orange-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-b border-orange-100 lg:hidden"
            >
              <div className="px-6 py-8 space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action || (() => setMobileMenuOpen(false))}
                    className="block w-full text-left py-4 px-6 rounded-xl text-lg font-medium text-slate-700 hover:bg-orange-100 hover:text-orange-600 transition"
                  >
                    {item.label}
                  </button>
                ))}

                <div className="pt-6 border-t border-orange-100">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold shadow-lg hover:shadow-xl transition"
                    >
                      Log Out
                    </button>
                  ) : (
                    <Link
                      to="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center py-4 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold shadow-lg hover:shadow-xl transition"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Padding for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;