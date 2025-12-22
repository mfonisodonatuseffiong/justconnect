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
    <aside className="
      hidden md:flex flex-col w-56
      bg-gradient-to-b from-purple-950/80 via-purple-900/70 to-accent/10
      backdrop-blur-xl
      border-r border-purple-800/40
      shadow-2xl
      p-6
      relative
    ">
      <ul className="space-y-3 mt-10">
        {navLinks.map(({ title, icon: Icon, link }) => (
          <motion.li
            key={title}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 260 }}
          >
            <NavLink
              to={link}
              end
              className={({ isActive }) =>
                `group flex items-center gap-3 p-3 rounded-xl font-semibold
                 transition-all duration-300 ${
                  isActive
                    ? "bg-accent text-white shadow-lg"
                    : "text-gray-300 hover:bg-purple-900/60 hover:text-accent"
                }`
              }
            >
              <Icon
                size={20}
                className="
                  transition-colors duration-300
                  text-gray-400
                  group-hover:text-accent
                "
              />
              <span className="text-sm">{title}</span>
            </NavLink>
          </motion.li>
        ))}
      </ul>

      {/* Logo */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <img
          src="/logo.png"
          alt="App Logo"
          className="h-10 w-auto opacity-70 hover:opacity-100 transition-opacity"
        />
      </div>
    </aside>
  );
};

export default UserAsideBar;
