/**
 * @description This is the professional dashboard navbar
 *              - Takes The HamburgerMenu for Mobile screen, logo, Avatar, Logout
 * @returns @ Dashboard Nav Bar
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";
import MobileMenu from "./MobileMenu";
import toast from "react-hot-toast";
import { getInitials } from "../../../utils/getInitials";
import { useAuthHook } from "../../../hooks/authHooks";
import { useAuthStore } from "../../../store/authStore";

const Navbar = () => {
  const { auth } = useAuthHook();
  const { user } = useAuthStore();

  const defaultPic = getInitials(user?.name);

  // Get page name
  const location = useLocation();
  let pageName = location.pathname.split("/").filter(Boolean).pop();
  if (pageName === "professional") {
    pageName = "Professional Dashboard";
  }

  // Function to log out of dashboard
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const result = await auth.logout();
      toast.success(result.message || "Log out successful.");
      navigate("/");
    } catch (error) {
      toast.error(
        error.message ||
          "Something went wrong while logging out, Please try again.",
      );
    }
  };

  return (
    <header className="h-18 shadow-md mb-4">
      <nav className="relative flex justify-between items-center px-4 md:px-8 h-full">
        {/** Left side page name */}
        <div className="flex items-center gap-3">
          <h2 className="hidden md:flex text-lg lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-accent to-black uppercase">
            {pageName}
          </h2>
          {/** Mobile Menu for medium screens below */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>

        {/** ==== Middle for mobile logo display ==================*/}
        <div>
          <Link to="/">
            <img
              src="/logo-white-bg.png"
              alt="app logo"
              className="h-8 w-auto flex md:hidden"
            />
          </Link>
        </div>

        {/** ========= Right side ================*/}
        <div className="flex items-center gap-4 translate durarion-500">
          <span className="hidden md:flex text-sm drop-shadow-secondary">
            {user.name}
          </span>
          {/** avatar */}
          <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-gray text-white text-sm">
            {user.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="user.name"
                className="w-full h-full rounded-full object-center"
              />
            ) : (
              <span>{defaultPic}</span>
            )}
          </div>

          {/** Logout button */}
          <button
            type="button"
            title="logout"
            aria-label="logout"
            onClick={handleLogout}
            className="flex items-center gap-2 text-accent text-sm rounded-full md:rounded-2xl hover:text-gray-700 transition-all duration-500"
          >
            <LogOutIcon size={14} />{" "}
            <span className="hidden md:flex"> Logout</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
