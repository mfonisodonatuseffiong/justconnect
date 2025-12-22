import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, User, Settings, MessageCircle } from "lucide-react";
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

  const [openDropdown, setOpenDropdown] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openMessages, setOpenMessages] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const dropdownRef = useRef(null);

  const defaultPic = getInitials(user?.name);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
        setOpenNotifications(false);
        setOpenMessages(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!user?.id) return;
        const res = await authAxios.get(`/api/v1/notifications/user/${user.id}`);
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, [user?.id]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!user?.id) return;
        const res = await authAxios.get(`/api/v1/messages/user/${user.id}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [user?.id]);

  const handleLogout = async () => {
    try {
      await auth.logout();
      clearUser();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast.success("Logged out successfully!");
      navigate("/auth/login");
    } catch (error) {
      toast.error(error.message || "Error logging out");
    }
  };

  return (
    <motion.header
      className="fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between px-6 md:px-8
                 bg-purple-950/90 backdrop-blur-md border-b border-purple-800 text-white"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* LEFT */}
      <div className="text-accent font-bold text-xl tracking-wide">
        User<span className="text-white">Dashboard</span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5 relative" ref={dropdownRef}>
        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setOpenNotifications(!openNotifications)}
          className="relative p-2 rounded-lg hover:bg-purple-900 transition"
        >
          <Bell className="text-accent" size={20} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </motion.button>

        {/* Notifications Dropdown */}
        <AnimatePresence>
          {openNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-14 top-14 w-72 bg-purple-950/95 border border-purple-800 rounded-xl shadow-lg overflow-hidden"
            >
              {notifications.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No new notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-4 py-3 border-b border-purple-800 text-sm text-white hover:bg-purple-900 transition"
                  >
                    {n.message}
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Icon */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setOpenMessages(!openMessages)}
          className="relative p-2 rounded-lg hover:bg-purple-900 transition"
        >
          <MessageCircle className="text-accent" size={20} />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {messages.length}
            </span>
          )}
        </motion.button>

        {/* Messages Dropdown */}
        <AnimatePresence>
          {openMessages && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-28 top-14 w-72 bg-purple-950/95 border border-purple-800 rounded-xl shadow-lg overflow-hidden"
            >
              {messages.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No new messages</p>
              ) : (
                <>
                  {messages.slice(0, 5).map((m) => (
                    <div
                      key={m.id}
                      className="px-4 py-3 border-b border-purple-800 text-sm text-white hover:bg-purple-900 transition"
                    >
                      <strong>{m.sender_name}:</strong> {m.content}
                    </div>
                  ))}
                  <button
                    onClick={() => navigate("/user-dashboard/messages")}
                    className="w-full text-center py-2 bg-purple-900 text-accent font-semibold hover:bg-accent hover:text-white transition"
                  >
                    View all messages
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar + Dropdown */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => setOpenDropdown(!openDropdown)}
          className="w-10 h-10 rounded-full border-2 border-accent bg-purple-900 flex items-center justify-center cursor-pointer overflow-hidden"
        >
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-accent font-semibold">{defaultPic}</span>
          )}
        </motion.div>

        <AnimatePresence>
          {openDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-14 w-48 bg-purple-950/95 border border-purple-800 rounded-xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => navigate("/user-dashboard/profile")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-900 transition text-white"
              >
                <User size={16} className="text-accent" />
                Profile
              </button>

              <button
                onClick={() => navigate("/user-dashboard/settings")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-900 transition text-white"
              >
                <Settings size={16} className="text-accent" />
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-600 transition text-white"
              >
                <LogOut size={16} className="text-red-500" />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default UserNavbar;
