/**
 * @description Professional dashboard sidebar
 * @returns Aside component
 */

import {
  User,
  Briefcase,
  CalendarCheck,
  Star,
  Settings,
  BarChart3,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const AsideBar = () => {
  const navLinks = [
    { title: "Overview", icon: <BarChart3 />, link: ".", name: "Overview" },
    {
      title: "Services & Offers",
      icon: <Briefcase />,
      link: "services",
      name: "Services",
    },
    {
      title: "Bookings",
      icon: <CalendarCheck />,
      link: "bookings",
      name: "Bookings",
    },
    { title: "Reviews", icon: <Star />, link: "reviews", name: "Reviews" },
    { title: "Profile", icon: <User />, link: "profile", name: "Profile" },
    {
      title: "Settings",
      icon: <Settings />,
      link: "settings",
      name: "Settings",
    },
  ];

  return (
    <aside className="relative hidden md:block w-48 lg:w-64 bg-gradient-to-b from-orange-600 to-rose-600 rounded-2xl shadow-xl text-white transition-all duration-500">
      <ul className="mt-20 space-y-2">
        {navLinks.map((n) => (
          <li key={n.title}>
            <NavLink
              to={n.link}
              title={n.name}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-l-xl transition-all duration-300 
                 ${isActive 
                   ? "bg-white text-orange-600 font-semibold shadow-md" 
                   : "hover:bg-orange-500/20"}`
              }
            >
              <span className="text-white">{n.icon}</span>
              <span>{n.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* App brand */}
      <div className="absolute bottom-10 left-0 w-full">
        <p className="text-center mb-4 text-sm text-white/80">Home</p>
        <Link to="/" title="Home">
          <img
            src="/logo.png"
            alt="brand logo"
            aria-label="App logo"
            className="h-10 w-auto mx-auto opacity-90 object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>
    </aside>
  );
};

export default AsideBar;
