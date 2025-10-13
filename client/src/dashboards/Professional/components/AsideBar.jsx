/**
 * @description This is the aside component of the professional bar
 * @returns Aside component
 */

import {
  User,
  Briefcase,
  Clipboard,
  MessageCircle,
  Star,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AsideBar = () => {
  const navLinks = [
    { title: "Jobs", icon: <Clipboard />, link: ".", name: "Jobs" },
    {
      title: "Services",
      icon: <Briefcase />,
      link: "services",
      name: "Services",
    },
    {
      title: "Messages",
      icon: <MessageCircle />,
      link: "messages",
      name: "Messages",
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
    <aside className="hidden md:block w-46 lg:w-64 bg-primary-gray rounded-b-2xl pl-3 transition-all duration-500">
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
                `flex items-center gap-4 p-3 uppercase text-sm lg:text-base  ${isActive ? "bg-brand-bg text-primary-gray rounded-l-full" : "text-white"}`
              }
            >
              <span className="text-accent"> {n.icon} </span>
              {n.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AsideBar;
