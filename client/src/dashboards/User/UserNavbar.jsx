// src/dashboards/User/UserNavbar.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MessageCircle, Settings, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { useAuthStore } from "../../store/authStore";
import authAxios from "../../api";
import { getInitials } from "../../utils/getInitials";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const UserNavbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  const [openNotifications, setOpenNotifications] = useState(false);
  const [openMessages, setOpenMessages] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);

  const initials = getInitials(user?.name);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenNotifications(false);
        setOpenMessages(false);
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [notifRes, msgRes] = await Promise.all([
          authAxios.get(`/notifications/user/${user.id}`),
          authAxios.get(`/messages/user/${user.id}`),
        ]);

        setNotifications(notifRes.data?.data || []);
        setMessages(msgRes.data?.data || msgRes.data?.messages || []);
      } catch (err) {
        console.error("Navbar fetch error:", err);
      }
    };

    fetchData();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("authenticate", user.id);
    });

    socket.on("new_notification", (n) => setNotifications((prev) => [n, ...prev]));
    socket.on("new_message", (m) => {
      setMessages((prev) => {
        const exists = prev.some((x) => x.id === m.id || x._id === m._id);
        return exists ? prev : [m, ...prev];
      });
    });

    return () => socket.disconnect();
  }, [user?.id]);

  // LOGOUT → MAIN HOME PAGE
  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/"); // ← This is the key line: goes to home, not login
  };

  const profilePicUrl = user?.profile_picture
    ? user.profile_picture.startsWith("http")
      ? user.profile_picture
      : `http://localhost:5000${user.profile_picture}`
    : null;

  return (
    <header
      ref={dropdownRef}
      className="sticky top-0 z-50 w-full h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm"
    >
      <div className="flex items-center justify-end h-full px-6 lg:px-12">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpenNotifications(!openNotifications)}
            className="relative p-3 rounded-xl hover:bg-gray-100/70 transition-all duration-200 group"
          >
            <Bell size={22} className="text-gray-700 group-hover:text-gray-900" />
            {notifications.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-rose-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white"
              >
                {notifications.length > 99 ? "99+" : notifications.length}
              </motion.span>
            )}
          </button>

          <button
            onClick={() => setOpenMessages(!openMessages)}
            className="relative p-3 rounded-xl hover:bg-gray-100/70 transition-all duration-200 group"
          >
            <MessageCircle size={22} className="text-gray-700 group-hover:text-gray-900" />
            {messages.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white"
              >
                {messages.length > 99 ? "99+" : messages.length}
              </motion.span>
            )}
          </button>

          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100/70 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden ring-4 ring-white shadow-lg group-hover:ring-orange-200 transition-all">
              {profilePicUrl ? (
                <img src={profilePicUrl} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-bold text-base">
                  {initials}
                </div>
              )}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-gray-900">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </button>

          <AnimatePresence>
            {openProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-18 right-6 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
              >
                <div className="p-6 bg-gradient-to-br from-orange-50 to-rose-50 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                      {profilePicUrl ? (
                        <img src={profilePicUrl} alt={user?.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-bold text-2xl">
                          {initials}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => navigate("/user-dashboard/profile")}
                    className="w-full flex items-center gap-4 px-6 py-3 hover:bg-orange-50/70 transition"
                  >
                    <User size={20} className="text-gray-700" />
                    <span className="font-medium text-gray-800">My Profile</span>
                  </button>
                  <button
                    onClick={() => navigate("/user-dashboard/settings")}
                    className="w-full flex items-center gap-4 px-6 py-3 hover:bg-orange-50/70 transition"
                  >
                    <Settings size={20} className="text-gray-700" />
                    <span className="font-medium text-gray-800">Settings</span>
                  </button>
                  <div className="border-t border-gray-100 my-2 mx-4" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-3 hover:bg-red-50 transition"
                  >
                    <LogOut size={20} className="text-red-600" />
                    <span className="font-medium text-red-600">Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;