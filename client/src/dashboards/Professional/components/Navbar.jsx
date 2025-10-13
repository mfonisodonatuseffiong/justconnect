/**
 * @description This is the professional dashboard navbar
 *              - Takes The HamburgerMenu for Mobile screen, logo, Avatar, Logout
 * @returns @ Dashboard Nav Bar
 */

import { LogOutIcon } from "lucide-react";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  return (
    <header className="h-18 shadow-md mb-4">
      <nav className="relative flex justify-between items-center px-4 md:px-10 h-full">
        {/**left side  app Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/logo-white-bg.webp"
            alt="app logo"
            className="size-34 hidden md:flex"
          />

          {/** Mobile Menu for medium screens below */}
          <MobileMenu />
        </div>
        {/** middle for mobile logo display */}
        <div>
          <img
            src="/logo-white-bg.webp"
            alt="app logo"
            className="size-34 flex md:hidden"
          />
        </div>

        {/** Right side */}
        <div className="flex items-center gap-2 md:gap-8">
          {/** avatar */}
          <img
            src="/hero.webp"
            alt="profile avatar"
            className="size-9 rounded-full ring-2 ring-accent object-center"
          />
          {/** Logout button */}
          <button
            type="button"
            title="logout"
            aria-label="logout"
            className="flex items-center gap-4 hover:bg-accent bg-gray-50 text-accent p-4 md:py-2 md:px-8 rounded-full md:rounded-2xl hover:text-white transition-all duration-500"
          >
            <LogOutIcon /> <span className="hidden md:flex"> Logout</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
