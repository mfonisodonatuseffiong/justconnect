import { NavLink } from "react-router-dom";
import {
  Home,
  UserCheck,
  CalendarCheck,
  MessageCircle,
  User,
  Settings,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { title: "Home", icon: Home, link: "." },
  { title: "My Requests", icon: UserCheck, link: "requests" },
  { title: "Bookings", icon: CalendarCheck, link: "bookings" },
  { title: "Book a Professional", icon: Briefcase, link: "bookings/new" },
  { title: "Messages", icon: MessageCircle, link: "messages" },
  { title: "Profile", icon: User, link: "profile" },
  { title: "Settings", icon: Settings, link: "settings" },
];

const UserAsideBar = () => {
  return (
    <aside
      className="
        hidden md:flex flex-col w-72 min-h-screen
        bg-gradient-to-b from-white via-orange-50/50 to-orange-100/30
        border-r-2 border-orange-200
        shadow-2xl
        px-6 py-10
        relative overflow-hidden
      "
    >
      {/* Optional subtle decorative element */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200/10 via-transparent to-rose-200/10 pointer-events-none" />

      {/* Navigation Links */}
      <nav className="flex-1 mt-8">
        <ul className="space-y-3">
          {navLinks.map(({ title, icon: Icon, link }) => (
            <motion.li
              key={title}
              whileHover={{ x: 8 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <NavLink
                to={link}
                end
                className={({ isActive }) =>
                  `
                  group relative flex items-center gap-4 px-6 py-4 rounded-2xl
                  font-semibold text-base tracking-wide transition-all duration-300
                  overflow-hidden
                  ${
                    isActive
                      ? "bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-xl"
                      : "text-slate-700 hover:bg-orange-100/70 hover:text-orange-600"
                  }
                `
                }
              >
                {/* Active indicator bar */}
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    <Icon
                      size={22}
                      className={`
                        relative z-10 transition-colors duration-300
                        ${isActive ? "text-white" : "text-slate-500 group-hover:text-orange-600"}
                      `}
                    />
                    <span className="relative z-10">{title}</span>

                    {/* Hover glow effect */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-300/20 to-rose-300/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    )}
                  </>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Footer Logo */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full blur-xl opacity-40 scale-150" />
          <img
            src="/logo.png"
            alt="JustConnect Logo"
            className="
              relative h-14 w-auto
              drop-shadow-lg
              hover:drop-shadow-2xl
              transition-all duration-300
            "
          />
        </motion.div>

        <p className="text-center mt-3 text-xs text-slate-500 font-medium">
          © 2025 JustConnect
        </p>
      </div>
    </aside>
  );
};

export default UserAsideBar;