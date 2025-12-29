// src/dashboards/User/UserDashboardLayout.jsx
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import UserNavbar from "./UserNavbar";
import UserAsideBar from "./UserAsideBar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

export const UserDashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-orange-50 text-slate-800">
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
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="
              bg-white
              rounded-2xl
              border border-orange-200
              shadow-md
              p-6
              min-h-full
            "
          >
            <Outlet />
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
};

export default UserDashboardLayout;
