// src/dashboards/User/UserNavbar.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MessageCircle, Settings, LogOut, User } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthHook } from "../../hooks/authHooks";
import { useAuthStore } from "../../store/authStore";
import { getInitials } from "../../utils/getInitials";
import authAxios from "../../api";

const UserNavbar = () => {
  const navigate = useNavigate();
  const { auth } = useAuthHook();
  const { user, clearUser } = useAuthStore();

  const [openNotifications, setOpenNotifications] = useState(false);
  const [openMessages, setOpenMessages] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const dropdownRef = useRef(null);

  const defaultPic = getInitials(user?.name);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenNotifications(false);
        setOpenMessages(false);
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch notifications & messages
  useEffect(() => {
    if (!user?.id) return;
    authAxios.get(`/api/v1/notifications/user/${user.id}`)
      .then(res => setNotifications(res.data.notifications || []))
      .catch(() => setNotifications([]));

    authAxios.get(`/api/v1/messages/user/${user.id}`)
      .then(res => setMessages(res.data.messages || []))
      .catch(() => setMessages([]));
  }, [user?.id]);

  const handleLogout = async () => {
    try {
      await auth.logout();
      clearUser();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast.success("Logged out successfully");
      navigate("/auth/login");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <header
      className="
        sticky top-0 z-50
        h-16 w-full
        bg-white/90 backdrop-blur-md
        border-b border-gray-200
        shadow-sm
        flex items-center justify-end
        px-6 lg:px-10
      "
      ref={dropdownRef}
    >
      {/* Right Section: Icons + Avatar */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          onClick={() => setOpenNotifications(!openNotifications)}
          className="relative p-2.5 rounded-lg hover:bg-gray-100 transition"
        >
          <Bell size={20} className="text-gray-600" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {notifications.length > 99 ? "99+" : notifications.length}
            </span>
          )}
        </button>

        {/* Messages */}
        <button
          onClick={() => setOpenMessages(!openMessages)}
          className="relative p-2.5 rounded-lg hover:bg-gray-100 transition"
        >
          <MessageCircle size={20} className="text-gray-600" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {messages.length > 99 ? "99+" : messages.length}
            </span>
          )}
        </button>

        {/* Avatar + Profile Dropdown */}
        <button
          onClick={() => setOpenProfile(!openProfile)}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-semibold">
            {defaultPic}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </button>

        {/* Notifications Dropdown */}
        <AnimatePresence>
          {openNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 right-32 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{n.time_ago || "Just now"}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Dropdown */}
        <AnimatePresence>
          {openMessages && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 right-20 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Messages</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No new messages</p>
                ) : (
                  <>
                    {messages.slice(0, 5).map((m) => (
                      <div key={m.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm font-bold">
                          {getInitials(m.sender_name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{m.sender_name}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{m.content}</p>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => navigate("/user-dashboard/messages")}
                      className="w-full py-3 bg-gray-50 text-gray-700 font-medium hover:bg-gray-100"
                    >
                      View all messages
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Dropdown */}
        <AnimatePresence>
          {openProfile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 right-4 w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <button
                onClick={() => navigate("/user-dashboard/profile")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700"
              >
                <User size={18} />
                My Profile
              </button>

              <button
                onClick={() => navigate("/user-dashboard/settings")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700"
              >
                <Settings size={18} />
                Settings
              </button>

              <div className="border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 font-medium"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default UserNavbar;