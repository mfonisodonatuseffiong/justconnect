/**
 * @description This is the aside component of the professional bar
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
    <aside className="relative hidden md:block w-46 lg:w-64 bg-primary-gray rounded-2xl shadow-2xl shadow-black/50 pl-3 transition-all duration-500">
      <ul className="mt-20">
        {navLinks.map((n) => (
          <li
            key={n.title}
            className="my-6 cursor-pointer hover:bg-brand-bg/20 hover:rounded-l-xl duration-300 transition-all"
          >
            <NavLink
              to={n.link}
              title={n.name}
              end
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 first-letter:uppercase text-xs  ${isActive ? "bg-brand-bg text-primary-gray rounded-l-full" : "text-white"}`
              }
            >
              <span className="text-accent"> {n.icon} </span>
              {n.title}
            </NavLink>
          </li>
        ))}
      </ul>
      {/** =============== App brand ============= */}
      <div className="absolute bottom-10 left-0 w-full">
        <p className="text-center mb-4 text-white text-sm"> Home </p>
        <Link to="/" title="Home">
          <img
            src="/logo.png"
            alt="brand logo"
            aria-label="App logo"
            className="h-10 w-auto mx-auto opacity-75 object-cover hover:-translate-y-1 duration-300"
          />
        </Link>
      </div>
    </aside>
  );
};

export default AsideBar;
