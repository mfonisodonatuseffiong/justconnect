import { useEffect, useState } from "react";
import { Users, Wrench, Settings, Calendar, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authAxios from "@/api";

// Reusable Stat Card component
const StatCard = ({ title, value, icon: Icon, color, loading, error }) => (
  <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300 overflow-hidden group">
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
            {title}
          </p>

          {loading ? (
            <div className="mt-2 h-8 w-16 bg-slate-200 rounded animate-pulse" />
          ) : error ? (
            <p className="mt-2 text-sm text-red-500">Error</p>
          ) : (
            <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          )}
        </div>

        <div
          className={`p-4 rounded-xl bg-gradient-to-br ${color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon size={28} />
        </div>
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProfessionals: 0,
    totalServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await authAxios.get("/admin/stats");
      setStats(res.data.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentData = async () => {
    try {
      const [bookingsRes, activityRes] = await Promise.all([
        authAxios.get("/admin/recent-bookings"),
        authAxios.get("/admin/recent-activity"),
      ]);

      setRecentBookings(bookingsRes.data.bookings || []);
      setRecentActivity(activityRes.data.activity || []);
    } catch (err) {
      console.error("Failed to fetch recent data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentData();
  }, []);

  const statItems = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-orange-500 to-amber-600",
    },
    {
      title: "Total Professionals",
      value: stats.totalProfessionals,
      icon: Wrench,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Total Services",
      value: stats.totalServices,
      icon: Settings,
      color: "from-purple-500 to-violet-600",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      icon: AlertCircle,
      color: "from-red-500 to-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-rose-50/30 p-6 lg:p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-rose-500 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Monitor platform activity, manage users & professionals, and oversee services.
        </p>
      </div>

      {/* Stats */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
          <AlertCircle className="mx-auto mb-3" size={40} />
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {statItems.map((item, i) => (
            <StatCard
              key={i}
              title={item.title}
              value={loading ? "—" : item.value}
              icon={item.icon}
              color={item.color}
              loading={loading}
              error={error}
            />
          ))}
        </div>
      )}

      {/* Quick Actions + Recent Activity */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100/50 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Approve Professionals", path: "/admin/professionals" },
              { label: "View All Users", path: "/admin/users" },
              { label: "Manage Services", path: "/admin/services" },
              { label: "Recent Bookings", path: "/admin/bookings" },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl text-center font-medium text-orange-700 transition-all hover:shadow-md"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100/50 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Recent Activity
          </h2>

          {recentActivity.length === 0 ? (
            <p className="text-slate-500">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl"
                >
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Users size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">
                      {item.name} registered
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="mt-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100/50 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Recent Bookings
        </h2>

        {recentBookings.length === 0 ? (
          <p className="text-slate-500">No recent bookings</p>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl"
              >
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">
                    {b.user_name} booked {b.professional_name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {b.status} •{" "}
                    {new Date(b.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
