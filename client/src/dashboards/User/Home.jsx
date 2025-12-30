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
  pending: "#f97316",     // orange-500
  completed: "#fb7185",   // rose-400
  canceled: "#ef4444",    // red-500
  unknown: "#9ca3af",     // gray-400
};

const KnobCard = ({ title, value, Icon }) => (
  <motion.div
    whileHover={{ scale: 1.08, y: -8 }}
    className="flex flex-col items-center"
  >
    <div className="relative w-36 h-36 rounded-full bg-white border-6 border-orange-300 shadow-2xl flex items-center justify-center">
      <div className="absolute top-3 w-2 h-6 bg-orange-600 rounded-full shadow-md" />
      
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 shadow-inner flex flex-col items-center justify-center border-4 border-white">
        <Icon size={28} className="text-orange-600 mb-2" />
        <span className="text-3xl font-extrabold text-slate-800">{value}</span>
      </div>
    </div>
    <p className="mt-5 text-base font-semibold text-slate-700 tracking-wider">{title}</p>
  </motion.div>
);

const UserHome = () => {
  const { data, loading, refetch } = useDashboard();

  const kpiCards = [
    { title: "Total Bookings", value: data?.totalBookings ?? 0, Icon: CalendarCheck },
    { title: "Completed", value: data?.stats?.completed ?? 0, Icon: CheckCircle },
    { title: "Pending", value: data?.stats?.pending ?? 0, Icon: FileText },
    { title: "Messages", value: data?.messages ?? 0, Icon: MessageCircle },
  ];

  const chartData = data?.bookingStatus
    ? data.bookingStatus.map(item => ({
        status: item.status,
        count: parseInt(item.count, 10),
        color: STATUS_COLORS[item.status] || STATUS_COLORS.unknown,
      }))
    : [];

  const weeklyData = data?.weeklyRequests || [];

  return (
    <div className="min-h-screen bg-orange-50 p-6 lg:p-10 space-y-16 text-slate-800">
      {/* Elegant Header Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto py-12"
      >
        <h1 className="text-5xl lg:text-6xl font-extrabold text-orange-500 leading-tight">
          Dashboard
        </h1>
        <p className="mt-8 text-xl lg:text-2xl text-slate-600 font-light leading-relaxed max-w-3xl mx-auto">
          Seamlessly manage bookings, monitor service progress, and maintain direct communication with verified professionals — everything centralized for your convenience.
        </p>
      </motion.section>

      {/* KPI Knob Cards */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center">
          {kpiCards.map((card) => (
            <KnobCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      {/* Booking Status Summary Cards */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {chartData.map((card) => (
            <motion.div
              key={card.status}
              whileHover={{ scale: 1.05, y: -6 }}
              className="bg-white border-2 border-orange-200 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all"
            >
              {card.status === "completed" && (
                <CheckCircle className="mx-auto mb-4 text-rose-500" size={48} />
              )}
              {card.status === "pending" && (
                <FileText className="mx-auto mb-4 text-orange-500" size={48} />
              )}
              {card.status === "canceled" && (
                <XCircle className="mx-auto mb-4 text-red-500" size={48} />
              )}
              <p className="capitalize text-lg font-semibold text-slate-600">{card.status}</p>
              <p className="text-4xl font-extrabold text-slate-800 mt-2">{card.count}</p>
            </motion.div>
          ))}

          {/* Total Bookings Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -6 }}
            className="bg-gradient-to-br from-orange-400 to-rose-400 rounded-3xl p-8 text-center shadow-xl text-white"
          >
            <CalendarCheck className="mx-auto mb-4" size={48} />
            <p className="text-lg font-semibold opacity-90">All Time Total</p>
            <p className="text-5xl font-extrabold mt-2">{data?.totalBookings ?? 0}</p>
          </motion.div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
        {/* Weekly Requests Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white border-2 border-orange-200 rounded-3xl p-8 shadow-xl h-96"
        >
          <h2 className="text-2xl font-bold mb-6 text-orange-600">Weekly Requests Trend</h2>
          {weeklyData.length === 0 ? (
            <p className="text-slate-500 text-center mt-32 text-lg">No requests this week yet</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#fed7aa" />
                <XAxis dataKey="day" stroke="#475569" fontSize={14} />
                <YAxis stroke="#475569" fontSize={14} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "2px solid #fb923c", borderRadius: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#f97316"
                  strokeWidth={4}
                  dot={{ fill: "#fb7185", r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Booking Status Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white border-2 border-orange-200 rounded-3xl p-8 shadow-xl h-96"
        >
          <h2 className="text-2xl font-bold mb-6 text-orange-600">Current Booking Status</h2>
          {chartData.length === 0 ? (
            <p className="text-slate-500 text-center mt-32 text-lg">No booking data available</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#fed7aa" />
                <XAxis dataKey="status" stroke="#475569" fontSize={14} />
                <YAxis allowDecimals={false} stroke="#475569" fontSize={14} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "2px solid #fb923c", borderRadius: "12px" }}
                />
                <Bar dataKey="count" radius={[20, 20, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </section>

      {/* Action Buttons */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
      >
        <Link to="/user-dashboard/requests">
          <button className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-400 px-10 py-5 font-bold text-white text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition transform">
            View All Requests <ArrowRight size={20} />
          </button>
        </Link>

        <Link to="/user-dashboard/bookings">
          <button
            onClick={refetch}
            className="flex items-center justify-center gap-3 rounded-2xl bg-white border-4 border-orange-300 text-orange-600 px-10 py-5 font-bold text-lg shadow-xl hover:bg-orange-500 hover:text-white hover:border-orange-400 transition transform hover:scale-105"
          >
            Refresh Bookings <ArrowRight size={20} />
          </button>
        </Link>
      </motion.section>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <p className="text-slate-600 text-xl">Loading your dashboard...</p>
        </div>
      )}
    </div>
  );
};

export default UserHome;