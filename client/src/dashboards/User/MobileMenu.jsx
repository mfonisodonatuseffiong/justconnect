// src/dashboards/User/MobileMenu.jsx
/**
 * @description Mobile menu dropdown for user dashboard (dark + accent theme)
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
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md bg-black/80 text-accent hover:bg-gray-800 transition"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-black/90 border border-gray-700 rounded-xl shadow-lg overflow-hidden z-50"
          >
            <Link
              to="/user-dashboard"
              className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-accent transition"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/user-dashboard/requests"
              className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-accent transition"
              onClick={() => setOpen(false)}
            >
              My Requests
            </Link>
            <Link
              to="/user-dashboard/appointments"
              className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-accent transition"
              onClick={() => setOpen(false)}
            >
              My Appointments
            </Link>
            <Link
              to="/user-dashboard/messages"
              className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-accent transition"
              onClick={() => setOpen(false)}
            >
              Messages
            </Link>
            <Link
              to="/user-dashboard/settings"
              className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-accent transition"
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;
