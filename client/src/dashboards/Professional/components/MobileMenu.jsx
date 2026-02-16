/**
 * @returns Mobile menu + hamburger icon styled with orange, rose, and amber brand colors
 */

import {
  User,
  Briefcase,
  BarChart3,
  CalendarCheck,
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
    { title: "Overview", icon: <BarChart3 />, link: "." },
    { title: "Services & Offers", icon: <Briefcase />, link: "services" },
    { title: "Bookings", icon: <CalendarCheck />, link: "bookings" },
    { title: "Reviews", icon: <Star />, link: "reviews" },
    { title: "Profile", icon: <User />, link: "profile" },
    { title: "Settings", icon: <Settings />, link: "settings" },
  ];

  return (
    <>
      {/* Hamburger icon */}
      <button
        type="button"
        aria-label="Menu"
        onClick={() => setDisplay(!display)}
        className="md:hidden text-orange-600"
      >
        <MenuIcon />
      </button>

      {/* Mobile menu */}
      {display && (
        <div
          className="absolute w-full top-0 left-0 py-10 px-4 bg-gradient-to-b from-rose-600 via-orange-500 to-amber-500 text-white rounded-b-2xl shadow-lg"
          data-aos="fade-down"
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="close menu display"
            onClick={() => setDisplay(false)}
            className="block mb-16 ml-auto text-white hover:bg-orange-600 rounded-full p-2 transition"
          >
            <X size={28} />
          </button>

          {/* Navigation links */}
          <ul>
            {navLinks.map((n) => (
              <li key={n.title} className="my-3 cursor-pointer transition-all">
                <NavLink
                  to={n.link}
                  onClick={() => setDisplay(false)}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl text-sm uppercase transition-all duration-300 
                     ${isActive 
                       ? "bg-white text-rose-600 font-semibold shadow-md" 
                       : "hover:bg-orange-500/20"}`
                  }
                >
                  <span className="text-amber-200">{n.icon}</span>
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
