// src/dashboards/User/UserHome.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  CheckCircle,
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

/* Warm Orange + Rose Palette */
const STATUS_COLORS = {
  pending: "#fb923c",
  completed: "#fb7185",
  cancelled: "#ef4444",
  unknown: "#9ca3af",
};

/* =====================
   KPI CARD
===================== */
const KnobCard = ({ title, value, Icon }) => (
  <motion.div
    whileHover={{ scale: 1.1, y: -10 }}
    transition={{ type: "spring", stiffness: 200 }}
    className="relative group"
  >
    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-orange-100 via-white to-rose-100 shadow-2xl flex items-center justify-center border-4 border-orange-300">
      <div className="w-28 h-28 rounded-full bg-white shadow-inner flex flex-col items-center justify-center">
        <Icon size={30} className="text-orange-500 mb-2" />
        <span className="text-3xl font-extrabold text-slate-800">
          {value}
        </span>
      </div>
    </div>

    <p className="mt-6 text-center text-sm uppercase tracking-widest font-semibold text-slate-600">
      {title}
    </p>
  </motion.div>
);

const UserHome = () => {
  const { dashboard, loading, error } = useDashboard();

  const kpiCards = [
    {
      title: "Total Bookings",
      value: dashboard.stats.totalBookings,
      Icon: CalendarCheck,
    },
    {
      title: "Completed",
      value: dashboard.stats.completedBookings,
      Icon: CheckCircle,
    },
    {
      title: "Pending",
      value: dashboard.stats.pendingBookings,
      Icon: FileText,
    },
    {
      title: "Messages",
      value: dashboard.messages,
      Icon: MessageCircle,
    },
  ];

  const chartData = dashboard.bookingStatus.map((item) => ({
    status: item.status,
    count: item.count,
    color: STATUS_COLORS[item.status] || STATUS_COLORS.unknown,
  }));

  const weeklyData = dashboard.weeklyRequests;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 px-6 lg:px-12 py-10 space-y-20 text-slate-800">
      {/* =====================
          HEADER
      ====================== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
          User Dashboard
        </h1>
        <p className="mt-6 text-lg lg:text-xl text-slate-600">
          Track your bookings, monitor progress, and stay connected with
          professionals effortlessly.
        </p>
      </motion.section>

      {/* =====================
          KPI SECTION
      ====================== */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-14 justify-items-center">
          {kpiCards.map((card) => (
            <KnobCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      {/* =====================
          CHARTS
      ====================== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {/* Weekly Requests */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/90 backdrop-blur border border-orange-200 rounded-3xl p-8 shadow-xl h-[420px]"
        >
          <h2 className="text-xl font-bold mb-6 text-orange-600">
            Weekly Requests Trend
          </h2>

          {weeklyData.length === 0 ? (
            <p className="text-center text-slate-500 mt-32">
              No requests this week yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#f97316"
                  strokeWidth={4}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Booking Status */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/90 backdrop-blur border border-orange-200 rounded-3xl p-8 shadow-xl h-[420px]"
        >
          <h2 className="text-xl font-bold mb-6 text-orange-600">
            Booking Status Overview
          </h2>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[16, 16, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </section>

      {/* =====================
          ACTION BUTTONS
      ====================== */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center pt-8"
      >
        <Link
          to="/user-dashboard/bookings"
          className="flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg
                     border-4 border-orange-400 text-orange-600 bg-white
                     hover:bg-orange-500 hover:text-white hover:border-orange-500
                     shadow-xl hover:shadow-2xl hover:scale-105 transition"
        >
          View All Bookings <ArrowRight />
        </Link>
      </motion.section>

      {/* =====================
          STATES
      ====================== */}
      {loading && (
        <p className="text-center py-20 text-xl text-slate-600">
          Loading your dashboard...
        </p>
      )}

      {error && (
        <p className="text-center py-20 text-xl text-red-600">
          Error: {error}
        </p>
      )}
    </div>
  );
};

export default UserHome;
