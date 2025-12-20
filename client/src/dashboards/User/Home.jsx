// src/dashboards/User/UserHome.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  XCircle,
  CalendarCheck,
  FileText,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";
import useDashboard from "../../hooks/useDashboard";
import { useAuthStore } from "../../store/authStore";

const STATUS_COLORS = {
  pending: "#f59e0b",
  completed: "#22c55e",
  canceled: "#ef4444",
  unknown: "#6b7280",
};

const UserHome = () => {
  const { user } = useAuthStore();
  const { data, loading } = useDashboard(); // ✅ removed error usage

  const firstName = user?.name?.split(" ")[0] || "there";

  // KPI cards from backend data
  const kpiCards = [
    { title: "My Requests", value: data?.totalBookings || 0, Icon: CalendarCheck },
    { title: "Completed", value: data?.statusCount?.completed || 0, Icon: CheckCircle },
    { title: "Bookings", value: data?.statusCount?.pending || 0, Icon: FileText },
    { title: "Messages", value: data?.messages || 0, Icon: MessageCircle },
  ];

  const chartData = data?.statusCount
    ? Object.entries(data.statusCount).map(([status, count]) => ({
        status,
        count,
        color: STATUS_COLORS[status] || STATUS_COLORS.unknown,
      }))
    : [];

  const weeklyData = data?.weeklyRequests || [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 p-6 space-y-10 text-white">
      {/* Welcome Section */}
      <section className="bg-black/70 rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-accent mb-3">
          Welcome back, {firstName}
        </h1>
        <p className="text-gray-400 text-lg">
          Here’s your personalized dashboard overview
        </p>
      </section>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card) => (
          <motion.div key={card.title} whileHover={{ scale: 1.03 }}>
            <div className="bg-black/70 rounded-xl shadow-lg p-6 flex items-center gap-4">
              <card.Icon className="w-8 h-8 text-accent" />
              <div>
                <p className="text-sm text-gray-400">{card.title}</p>
                <h2 className="text-xl font-bold text-accent">{card.value}</h2>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/70 rounded-xl shadow-lg p-6 flex flex-col items-center">
          <Calendar className="text-accent mb-2" size={36} />
          <p className="text-gray-400">Total Bookings</p>
          <p className="text-3xl font-bold text-accent">{data?.totalBookings || 0}</p>
        </div>

        {chartData.map((card) => (
          <div
            key={card.status}
            className="bg-black/70 rounded-xl shadow-lg p-6 flex flex-col items-center"
          >
            {card.status === "completed" && (
              <CheckCircle className="text-green-500 mb-2" size={36} />
            )}
            {card.status === "pending" && (
              <Calendar className="text-yellow-500 mb-2" size={36} />
            )}
            {card.status === "canceled" && (
              <XCircle className="text-red-500 mb-2" size={36} />
            )}
            <p className="capitalize text-gray-400">{card.status}</p>
            <p className="text-3xl font-bold text-accent">{card.count}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Requests Line Chart */}
        <div className="bg-black/70 rounded-xl shadow-lg p-6 h-80">
          <h2 className="text-lg font-bold mb-4">Requests This Week</h2>
          {weeklyData.length === 0 ? (
            <p className="text-gray-400 text-center mt-24">No requests this week</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Booking Status Bar Chart */}
        <div className="bg-black/70 rounded-xl shadow-lg p-6 h-80">
          <h2 className="text-lg font-bold mb-4">Booking Status</h2>
          {chartData.length === 0 ? (
            <p className="text-gray-400 text-center mt-24">
              No booking data available
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="status" stroke="#aaa" />
                <YAxis allowDecimals={false} stroke="#aaa" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    borderColor: "#f59e0b",
                  }}
                  itemStyle={{ color: "#f59e0b" }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link to="/user-dashboard/requests">
          <button className="flex items-center gap-2 rounded-lg bg-accent text-white px-6 py-3 font-semibold shadow-lg hover:bg-white hover:text-accent transition">
            View Requests <ArrowRight size={16} />
          </button>
        </Link>

        <Link to="/user-dashboard/bookings">
          <button className="flex items-center gap-2 rounded-lg border border-accent text-accent px-6 py-3 font-semibold hover:bg-accent hover:text-white transition">
            View Bookings <ArrowRight size={16} />
          </button>
        </Link>
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-400">Loading dashboard...</p>}
    </div>
  );
};

export default UserHome;
