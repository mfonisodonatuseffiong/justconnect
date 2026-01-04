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
import { io } from "socket.io-client";

// Vite environment variable
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
// Backend base URL for images
const BACKEND_URL = "http://localhost:5000";

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
  const [socket, setSocket] = useState(null);

  const defaultPic = getInitials(user?.name);

  // Close dropdowns when clicking outside
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

  // Fetch initial notifications and messages
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [notifRes, msgRes] = await Promise.all([
          authAxios.get(`/notifications/user/${user.id}`),
          authAxios.get(`/messages/user/${user.id}`),
        ]);

        setNotifications(notifRes.data?.data || notifRes.data || []);
        setMessages(msgRes.data?.data || msgRes.data?.messages || []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchData();
  }, [user?.id]);

  // Socket.IO real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Navbar connected to Socket.IO");
      newSocket.emit("authenticate", user.id);
    });

    newSocket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.success("New notification!");
    });

    newSocket.on("notification_updated", ({ id, read }) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read } : n))
      );
    });

    newSocket.on("notification_deleted", ({ id }) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    });

    newSocket.on("new_message", (message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id || m._id === message._id);
        if (exists) return prev;
        return [message, ...prev];
      });
      toast.success("New message received!");
    });

    newSocket.on("message_deleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId && m._id !== messageId));
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [user?.id]);

  const handleLogout = async () => {
    try {
      await auth.logout();
      clearUser();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast.success("Logged out successfully");
      navigate("/auth/login");
    } catch {
      toast.error("Error logging out");
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header
      className="sticky top-0 z-50 h-16 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm flex items-center justify-end px-6 lg:px-10"
      ref={dropdownRef}
    >
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          onClick={() => setOpenNotifications(!openNotifications)}
          className="relative p-2.5 rounded-lg hover:bg-gray-100 transition"
        >
          <Bell size={20} className="text-gray-600" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
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
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {messages.length > 99 ? "99+" : messages.length}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => setOpenProfile(!openProfile)}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-md">
            {user?.profile_picture ? (
              <img
                src={
                  user.profile_picture.startsWith("http")
                    ? user.profile_picture
                    : `${BACKEND_URL}${user.profile_picture}`
                }
                alt={user?.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-semibold">
                {defaultPic}
              </div>
            )}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500">{user?.email || ""}</p>
          </div>
        </button>

        {/* Dropdowns */}
        <AnimatePresence>
          {/* Notifications Dropdown */}
          {openNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 right-32 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-rose-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Bell size={18} /> Notifications
                  {notifications.length > 0 && (
                    <span className="ml-auto text-sm text-orange-600">{notifications.length} new</span>
                  )}
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center py-12 text-gray-500">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${
                        !n.read ? "bg-orange-50/50" : ""
                      }`}
                    >
                      <p className="text-sm text-gray-800 font-medium">{n.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(n.created_at || n.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => navigate("/user-dashboard/notifications")}
                className="w-full py-3 bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                View all notifications
              </button>
            </motion.div>
          )}

          {/* Messages Dropdown */}
          {openMessages && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 right-20 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-rose-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <MessageCircle size={18} /> Messages
                  {messages.length > 0 && (
                    <span className="ml-auto text-sm text-orange-600">{messages.length} new</span>
                  )}
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-center py-12 text-gray-500">No messages yet</p>
                ) : (
                  <>
                    {messages.slice(0, 5).map((m) => (
                      <div key={m.id || m._id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {(m.sender_name || m.senderName || "P").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{m.sender_name || m.senderName || "Professional"}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{m.content || m.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(m.created_at || m.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => navigate("/user-dashboard/messages")}
                      className="w-full py-3 bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition"
                    >
                      View all messages
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Profile Dropdown */}
          {openProfile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 right-4 w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-rose-50 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                  {user?.profile_picture ? (
                    <img
                      src={
                        user.profile_picture.startsWith("http")
                          ? user.profile_picture
                          : `${BACKEND_URL}${user.profile_picture}`
                      }
                      alt={user?.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-bold text-lg">
                      {defaultPic}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user?.name || "User"}</p>
                  <p className="text-sm text-gray-600">{user?.email || ""}</p>
                </div>
              </div>

              <button
                onClick={() => navigate("/user-dashboard/profile")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition"
              >
                <User size={18} /> My Profile
              </button>

              <button
                onClick={() => navigate("/user-dashboard/settings")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition"
              >
                <Settings size={18} /> Settings
              </button>

              <div className="border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 font-medium transition"
                >
                  <LogOut size={18} /> Logout
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
