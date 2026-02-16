/**
 * Professional Dashboard Navbar (Redesigned)
 * - Clean, modern look matching the platform's orange-amber-rose palette
 * - Page title + professional name use gradient text
 * - Responsive: mobile hamburger + logo, desktop full layout
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import MobileMenu from "./MobileMenu";
import toast from "react-hot-toast";
import { getInitials } from "../../../utils/getInitials";
import { useAuthHook } from "../../../hooks/authHooks";
import { useAuthStore } from "../../../store/authStore";

export default function Navbar() {
  const { auth } = useAuthHook();
  const { user } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic page title
  let pageName = location.pathname.split("/").filter(Boolean).pop() || "Dashboard";
  if (pageName === "professional") pageName = "Professional Dashboard";
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  const initials = getInitials(user?.name || "Pro");

  const handleLogout = async () => {
    try {
      const result = await auth.logout();
      toast.success(result.message || "Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  return (
    <header className="h-16 md:h-20 bg-white/80 backdrop-blur-xl border-b border-rose-100/50 shadow-sm sticky top-0 z-50">
      <nav className="relative flex items-center justify-between px-4 md:px-8 h-full max-w-7xl mx-auto">
        {/* Left: Mobile menu + Page title (desktop) */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Hamburger – mobile only */}
          <div className="md:hidden">
            <MobileMenu />
          </div>

          {/* Page title – desktop only */}
          <h2 className="hidden md:block text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 bg-clip-text text-transparent tracking-tight">
            {pageName}
          </h2>
        </div>

        {/* Center: Logo – mobile only */}
        <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
          <Link to="/" className="block">
            <img
              src="/logo-white-bg.png"
              alt="JustConnect"
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right side: Name + Avatar + Logout */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Professional name – gradient text */}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-slate-700">
              Welcome back,
            </span>
            <span className="text-base md:text-lg font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 bg-clip-text text-transparent">
              {user?.name || "Professional"}
            </span>
          </div>

          {/* Avatar */}
          <div className="relative group">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-amber-300 shadow-sm transition-all group-hover:border-rose-400 group-hover:shadow-md group-hover:scale-105">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg">
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:text-orange-600 hover:bg-amber-50 transition-all duration-300 font-medium"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline text-sm font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
