// src/dashboards/Admin/AdminLayout.jsx
import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { LogOut, Users, Wrench, BarChart3, Settings } from "lucide-react"; // ← fixed
import { useAuthStore } from "../../store/authStore";

const AdminLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Wrench, label: "Professionals", path: "/admin/professionals" }, // ← changed from Tool
    { icon: Settings, label: "Services", path: "/admin/services" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } flex-shrink-0`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-orange-600">Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-full hover:bg-orange-50 text-orange-600"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="mt-6 px-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition"
            >
              <item.icon size={sidebarOpen ? 22 : 24} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
          >
            <LogOut size={sidebarOpen ? 22 : 24} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;