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

/* 🔥 Purple + Accent Colors */
const STATUS_COLORS = {
  pending: "#f97316",    // accent
  completed: "#8b5cf6",  // purple
  canceled: "#ef4444",   // red
  unknown: "#6b7280",
};

const UserHome = () => {
  const { user } = useAuthStore();
  const { data, loading } = useDashboard();

  const firstName = user?.name?.split(" ")[0] || "there";

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

      {/* 👋 Welcome */}
      <section className="bg-gradient-to-r from-purple-900/40 to-accent/30 rounded-2xl p-8 text-center shadow-xl">
        <h1 className="text-4xl font-extrabold text-accent mb-2">
          Welcome back, {firstName}
        </h1>
        <p className="text-gray-300 text-lg">
          Here’s your dashboard overview
        </p>
      </section>

      {/* 📊 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card) => (
          <motion.div key={card.title} whileHover={{ scale: 1.04 }}>
            <div className="bg-purple-950/60 border border-purple-800 rounded-2xl p-6 flex items-center gap-4 shadow-lg">
              <card.Icon className="w-9 h-9 text-accent" />
              <div>
                <p className="text-sm text-gray-400">{card.title}</p>
                <h2 className="text-2xl font-bold text-purple-300">
                  {card.value}
                </h2>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 📦 Booking Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-950/60 border border-purple-800 rounded-2xl p-6 text-center shadow-lg">
          <Calendar className="mx-auto mb-2 text-accent" size={36} />
          <p className="text-gray-400">Total Bookings</p>
          <p className="text-3xl font-bold text-purple-300">
            {data?.totalBookings || 0}
          </p>
        </div>

        {chartData.map((card) => (
          <div
            key={card.status}
            className="bg-purple-950/60 border border-purple-800 rounded-2xl p-6 text-center shadow-lg"
          >
            {card.status === "completed" && (
              <CheckCircle className="mx-auto mb-2 text-purple-400" size={36} />
            )}
            {card.status === "pending" && (
              <Calendar className="mx-auto mb-2 text-accent" size={36} />
            )}
            {card.status === "canceled" && (
              <XCircle className="mx-auto mb-2 text-red-500" size={36} />
            )}
            <p className="capitalize text-gray-400">{card.status}</p>
            <p className="text-3xl font-bold text-purple-300">{card.count}</p>
          </div>
        ))}
      </div>

      {/* 📈 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Requests */}
        <div className="bg-purple-950/60 border border-purple-800 rounded-2xl p-6 h-80 shadow-lg">
          <h2 className="text-lg font-bold mb-4 text-accent">
            Requests This Week
          </h2>
          {weeklyData.length === 0 ? (
            <p className="text-gray-400 text-center mt-24">
              No requests this week
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#f97316"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Booking Status */}
        <div className="bg-purple-950/60 border border-purple-800 rounded-2xl p-6 h-80 shadow-lg">
          <h2 className="text-lg font-bold mb-4 text-accent">
            Booking Status
          </h2>
          {chartData.length === 0 ? (
            <p className="text-gray-400 text-center mt-24">
              No booking data available
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                <XAxis dataKey="status" stroke="#aaa" />
                <YAxis allowDecimals={false} stroke="#aaa" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f0f0f",
                    borderColor: "#f97316",
                  }}
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 🚀 Quick Actions */}
      <div className="flex gap-4 mt-6">
        <Link to="/user-dashboard/requests">
          <button className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold shadow-lg hover:bg-accent/90 transition">
            View Requests <ArrowRight size={16} className="text-white" />
          </button>
        </Link>

        <Link to="/user-dashboard/bookings">
          <button className="flex items-center gap-2 rounded-xl border border-purple-500 text-purple-300 px-6 py-3 font-semibold hover:bg-purple-600 hover:text-white transition">
            View Bookings <ArrowRight size={16} className="text-white" />
          </button>
        </Link>
      </div>

      {loading && (
        <p className="text-gray-400 text-center">
          Loading dashboard...
        </p>
      )}
    </div>
  );
};

export default UserHome;
