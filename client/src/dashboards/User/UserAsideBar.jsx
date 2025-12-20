import { NavLink } from "react-router-dom";
import { Home, UserCheck, CalendarCheck, MessageCircle, User, Settings, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { title: "Home", icon: Home, link: ".", name: "Home" },
  { title: "My Requests", icon: UserCheck, link: "requests", name: "Requests" },
  { title: "Bookings", icon: CalendarCheck, link: "bookings", name: "Bookings" },
  { title: "Book a Professional", icon: Briefcase, link: "bookings/new", name: "Book" }, // 🆕 added
  { title: "Messages", icon: MessageCircle, link: "messages", name: "Messages" },
  { title: "Profile", icon: User, link: "profile", name: "Profile" },
  { title: "Settings", icon: Settings, link: "settings", name: "Settings" },
];

const UserAsideBar = () => {
  return (
    <aside className="hidden md:flex flex-col w-56 bg-black/80 shadow-xl p-6 relative">
      <ul className="space-y-3 mt-10">
        {navLinks.map((n) => {
          const Icon = n.icon;
          return (
            <motion.li
              key={n.title}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <NavLink
                to={n.link}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg font-semibold transition-colors duration-300 ${
                    isActive
                      ? "bg-accent text-white shadow-lg"
                      : "text-gray-400 hover:bg-gray-800 hover:text-accent"
                  }`
                }
              >
                <Icon className="text-accent" size={20} />
                {n.title}
              </NavLink>
            </motion.li>
          );
        })}
      </ul>

      {/* App Logo */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <img
          src="/logo.png"
          alt="App Logo"
          className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </aside>
  );
};

export default UserAsideBar;
