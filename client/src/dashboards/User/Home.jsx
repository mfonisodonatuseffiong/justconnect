import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  CheckCircle,
  FileText,
  MessageCircle,
  ArrowRight,
  XCircle,
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
  pending: "#f97316",
  completed: "#fb7185",
  cancelled: "#ef4444",
  unknown: "#9ca3af",
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
        <span className="text-3xl font-extrabold text-slate-800">
          {value}
        </span>
      </div>
    </div>
    <p className="mt-5 text-base font-semibold text-slate-700 tracking-wider">
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
    <div className="min-h-screen bg-orange-50 p-6 lg:p-10 space-y-16 text-slate-800">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto py-12"
      >
        <h1 className="text-5xl lg:text-6xl font-extrabold text-orange-500">
          Dashboard
        </h1>
        <p className="mt-8 text-xl lg:text-2xl text-slate-600 font-light">
          Seamlessly manage bookings, track progress, and communicate with
          professionals — all in one place.
        </p>
      </motion.section>

      {/* KPI Cards */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center">
          {kpiCards.map((card) => (
            <KnobCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      {/* Status Summary */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {chartData.map((card) => (
            <motion.div
              key={card.status}
              whileHover={{ scale: 1.05, y: -6 }}
              className="bg-white border-2 border-orange-200 rounded-3xl p-8 text-center shadow-xl"
            >
              {card.status === "completed" && (
                <CheckCircle className="mx-auto mb-4 text-rose-500" size={48} />
              )}
              {card.status === "pending" && (
                <FileText className="mx-auto mb-4 text-orange-500" size={48} />
              )}
              {card.status === "cancelled" && (
                <XCircle className="mx-auto mb-4 text-red-500" size={48} />
              )}

              <p className="capitalize text-lg font-semibold text-slate-600">
                {card.status}
              </p>
              <p className="text-4xl font-extrabold text-slate-800 mt-2">
                {card.count}
              </p>
            </motion.div>
          ))}

          {/* Total */}
          <motion.div
            whileHover={{ scale: 1.05, y: -6 }}
            className="bg-gradient-to-br from-orange-400 to-rose-400 rounded-3xl p-8 text-center shadow-xl text-white"
          >
            <CalendarCheck className="mx-auto mb-4" size={48} />
            <p className="text-lg font-semibold opacity-90">
              All Time Total
            </p>
            <p className="text-5xl font-extrabold mt-2">
              {dashboard.stats.totalBookings}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
        {/* Weekly Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white border-2 border-orange-200 rounded-3xl p-8 shadow-xl h-96"
        >
          <h2 className="text-2xl font-bold mb-6 text-orange-600">
            Weekly Requests Trend
          </h2>

          {weeklyData.length === 0 ? (
            <p className="text-slate-500 text-center mt-32">
              No requests this week yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#fed7aa" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#f97316"
                  strokeWidth={4}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Status Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white border-2 border-orange-200 rounded-3xl p-8 shadow-xl h-96"
        >
          <h2 className="text-2xl font-bold mb-6 text-orange-600">
            Current Booking Status
          </h2>

          {chartData.length === 0 ? (
            <p className="text-slate-500 text-center mt-32">
              No booking data available
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#fed7aa" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
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

      {/* Loading & Error */}
      {loading && (
        <div className="text-center py-20">
          <p className="text-slate-600 text-xl">
            Loading your dashboard...
          </p>
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <p className="text-red-600 text-xl">Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default UserHome;
