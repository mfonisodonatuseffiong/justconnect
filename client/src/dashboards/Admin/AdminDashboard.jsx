import { useEffect, useState } from "react";
import {
  Users,
  Wrench,
  Settings,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import authAxios from "@/api";

/* =======================
   Reusable Stat Card
======================= */
const StatCard = ({
  title,
  value,
  icon: Icon,
  gradient,
  softBg,
  loading,
  error,
}) => (
  <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300 overflow-hidden group">
    {/* Top Color Accent */}
    <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />

    <div className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          {title}
        </p>

        {loading ? (
          <div className="mt-2 h-8 w-20 bg-slate-200 rounded animate-pulse" />
        ) : error ? (
          <p className="mt-2 text-sm text-red-500">Error</p>
        ) : (
          <p className="mt-1 text-3xl font-extrabold text-slate-900">
            {value}
          </p>
        )}
      </div>

      <div
        className={`p-4 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md group-hover:scale-110 transition-transform`}
      >
        <Icon size={28} />
      </div>
    </div>
  </div>
);

/* =======================
   Admin Dashboard
======================= */
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
      gradient: "from-orange-500 to-amber-600",
    },
    {
      title: "Total Professionals",
      value: stats.totalProfessionals,
      icon: Wrench,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Total Services",
      value: stats.totalServices,
      icon: Settings,
      gradient: "from-purple-500 to-violet-600",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      icon: AlertCircle,
      gradient: "from-red-500 to-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-rose-50/40 p-6 lg:p-10">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-rose-500 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl">
          Monitor platform activity, manage users & professionals, and oversee
          services.
        </p>
      </div>

      {/* Stats */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
          <AlertCircle className="mx-auto mb-3" size={40} />
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:opacity-90 transition"
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
              gradient={item.gradient}
              loading={loading}
              error={error}
            />
          ))}
        </div>
      )}

      {/* Quick Actions + Recent Activity */}
      <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100/50 p-8">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent mb-6">
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
                className="p-4 rounded-xl font-semibold text-orange-700 bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all hover:shadow-md"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100/50 p-8">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-rose-500 bg-clip-text text-transparent mb-6">
            Recent Activity
          </h2>

          {recentActivity.length === 0 ? (
            <p className="text-slate-500">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-orange-50/60 rounded-xl"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
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
      <div className="mt-14 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100/50 p-8">
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-6">
          Recent Bookings
        </h2>

        {recentBookings.length === 0 ? (
          <p className="text-slate-500">No recent bookings</p>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-4 p-4 bg-green-50/60 rounded-xl"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    {b.user_name} booked {b.professional_name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {b.status} • {new Date(b.created_at).toLocaleString()}
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
