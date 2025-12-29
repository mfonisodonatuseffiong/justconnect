// src/dashboards/User/MobileMenu.jsx
/**
 * @description Mobile menu dropdown for user dashboard (warm orange-rose theme)
 */
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setOpen(!open);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Hamburger Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleMenu}
        className="
          p-3 rounded-2xl
          bg-gradient-to-br from-orange-400 to-rose-400
          text-white
          shadow-lg hover:shadow-xl
          transition-all duration-300
          flex items-center justify-center
        "
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="
              absolute right-0 mt-4 w-64
              bg-white/95 backdrop-blur-xl
              border-2 border-orange-200
              rounded-3xl shadow-2xl
              overflow-hidden z-50
            "
          >
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-orange-500 to-rose-400 p-5 text-white">
              <h3 className="font-bold text-lg text-center">Menu</h3>
            </div>

            {/* Navigation Links */}
            <nav className="py-3">
              <Link
                to="/user-dashboard"
                onClick={() => setOpen(false)}
                className="
                  block px-6 py-4 text-slate-700 font-medium
                  hover:bg-orange-100/70 hover:text-orange-600
                  transition-all duration-200
                  flex items-center gap-4
                "
              >
                <span className="w-8 text-center">🏠</span>
                Home
              </Link>

              <Link
                to="/user-dashboard/requests"
                onClick={() => setOpen(false)}
                className="
                  block px-6 py-4 text-slate-700 font-medium
                  hover:bg-orange-100/70 hover:text-orange-600
                  transition-all duration-200
                  flex items-center gap-4
                "
              >
                <span className="w-8 text-center">📩</span>
                My Requests
              </Link>

              <Link
                to="/user-dashboard/appointments"
                onClick={() => setOpen(false)}
                className="
                  block px-6 py-4 text-slate-700 font-medium
                  hover:bg-orange-100/70 hover:text-orange-600
                  transition-all duration-200
                  flex items-center gap-4
                "
              >
                <span className="w-8 text-center">📅</span>
                My Appointments
              </Link>

              <Link
                to="/user-dashboard/messages"
                onClick={() => setOpen(false)}
                className="
                  block px-6 py-4 text-slate-700 font-medium
                  hover:bg-orange-100/70 hover:text-orange-600
                  transition-all duration-200
                  flex items-center gap-4
                "
              >
                <span className="w-8 text-center">💬</span>
                Messages
              </Link>

              <Link
                to="/user-dashboard/settings"
                onClick={() => setOpen(false)}
                className="
                  block px-6 py-4 text-slate-700 font-medium
                  hover:bg-orange-100/70 hover:text-orange-600
                  transition-all duration-200
                  flex items-center gap-4
                "
              >
                <span className="w-8 text-center">⚙️</span>
                Settings
              </Link>
            </nav>

            {/* Footer Accent */}
            <div className="bg-gradient-to-r from-orange-100 to-rose-100 px-6 py-4 text-center">
              <p className="text-sm font-medium text-orange-700">
                JustConnect © 2025
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;