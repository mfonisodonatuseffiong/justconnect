/**
 *
 * @returns Mobile menu + hamburger icon
 */

import {
  User,
  Briefcase,
  Clipboard,
  MessageCircle,
  Star,
  Settings,
  MenuIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const MobileMenu = () => {
  const [display, setDisplay] = useState(false);

  const navLinks = [
    { title: "Jobs", icon: <Clipboard />, link: "." },
    { title: "Services", icon: <Briefcase />, link: "services" },
    { title: "Messages", icon: <MessageCircle />, link: "messages" },
    { title: "Reviews", icon: <Star />, link: "reviews" },
    { title: "Profile", icon: <User />, link: "profile" },
    { title: "Settings", icon: <Settings />, link: "settings" },
  ];

  return (
    <>
      <button
        type="button"
        aria-label="Menu"
        onClick={() => setDisplay(!display)}
        className="md:hidden"
      >
        <MenuIcon />
      </button>

      {/** display mobile menu on mobile screen  */}
      {display && (
        <div className="absolute w-full top-0 left-0 py-10 px-4 bg-primary-gray">
          {/** button to close menu */}
          <button
            type="button"
            aria-label="close menu display"
            onClick={() => setDisplay(false)}
            className="block mb-16 ml-auto hover:bg-gray-500 rounded-full"
          >
            <X size={36} />
          </button>
          <ul>
            {navLinks.map((n) => (
              <li
                key={n.title}
                className="my-6 cursor-pointer hover:bg-brand-bg/20 hover:rounded-l-xl duration-300 transition-all"
              >
                <NavLink
                  to={n.link}
                  onClick={() => setDisplay(false)}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-4 p-4 uppercase text-sm  ${isActive ? "bg-brand-bg text-primary-gray rounded-l-full" : "text-white"}`
                  }
                >
                  <span className="text-accent"> {n.icon} </span>
                  {n.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
