// src/dashboards/User/UserDashboardLayout.jsx
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import UserNavbar from "./UserNavbar";
import UserAsideBar from "./UserAsideBar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export const UserDashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-black/90 text-white">
      {/* Sidebar */}
      <UserAsideBar />

      {/* Main Content */}
      <motion.div
        className="flex flex-col flex-1 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Navbar */}
        <UserNavbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <div className="bg-black/70 rounded-xl shadow-lg p-6 h-full">
            <Outlet />
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default UserDashboardLayout;
