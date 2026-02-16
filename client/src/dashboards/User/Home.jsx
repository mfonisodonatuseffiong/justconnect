// src/dashboards/User/UserHome.jsx
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import useDashboard from "../../hooks/useDashboard";

// Status color map (matches your brand)
const STATUS_COLORS = {
  pending: "#f59e0b",      // amber-500
  completed: "#ec4899",    // rose-500
  cancelled: "#ef4444",    // red-500
  unknown: "#9ca3af",      // gray-400
};

/**
 * KPI Card – Elegant circular stat display
 */
const KpiCard = ({ title, value, Icon, color }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    className="relative group"
  >
    <div className="w-44 h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-white via-orange-50/50 to-rose-50/50 shadow-xl flex items-center justify-center border-4 border-white/80 backdrop-blur-sm">
      <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-white shadow-inner flex flex-col items-center justify-center">
        <Icon className={`w-10 h-10 md:w-12 md:h-12 mb-3 ${color}`} strokeWidth={2} />
        <span className="text-3xl md:text-4xl font-extrabold text-slate-800">
          {value}
        </span>
      </div>
    </div>
    <p className="mt-5 text-center text-sm md:text-base font-medium uppercase tracking-wider text-slate-600 group-hover:text-orange-600 transition-colors">
      {title}
    </p>
  </motion.div>
);

/**
 * Chart Card Wrapper – Reusable for both line & bar charts
 */
const ChartCard = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-white/90 backdrop-blur-xl rounded-3xl border border-orange-100/50 shadow-xl overflow-hidden"
  >
    <div className="px-6 py-5 border-b border-orange-100/50 bg-gradient-to-r from-orange-50/80 to-rose-50/80">
      <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
        {title}
      </h2>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

export default function UserHome() {
  const { dashboard, loading, error } = useDashboard();

  // Prepare chart data
  const bookingStatusData = (dashboard?.bookingStatus || []).map((item) => ({
    status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    count: item.count,
    color: STATUS_COLORS[item.status] || STATUS_COLORS.unknown,
  }));

  const weeklyData = dashboard?.weeklyRequests || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 px-4 sm:px-6 lg:px-12 py-8 md:py-12 space-y-12 md:space-y-20">
      {/* Hero Header */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 bg-clip-text text-transparent tracking-tight">
          Your Dashboard
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-slate-700 max-w-3xl mx-auto">
          Track your bookings, see your performance, and manage your services — all in one place.
        </p>
      </motion.section>

      {/* KPI Cards */}
      <section className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 justify-items-center">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="w-44 h-44 md:w-52 md:h-52 rounded-full bg-slate-100/80 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-600 text-xl">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14 justify-items-center">
            <KpiCard
              title="Total Bookings"
              value={dashboard?.stats?.totalBookings ?? 0}
              Icon={CalendarCheck}
              color="text-orange-600"
            />
            <KpiCard
              title="Completed"
              value={dashboard?.stats?.completedBookings ?? 0}
              Icon={CheckCircle2}
              color="text-rose-600"
            />
            <KpiCard
              title="Pending"
              value={dashboard?.stats?.pendingBookings ?? 0}
              Icon={Clock}
              color="text-amber-600"
            />
            <KpiCard
              title="Messages"
              value={dashboard?.messages ?? 0}
              Icon={MessageSquare}
              color="text-orange-600"
            />
          </div>
        )}
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
        {/* Weekly Trend */}
        <ChartCard title="Weekly Booking Trend">
          {weeklyData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-slate-500">
              No bookings this week yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={weeklyData} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.98)",
                    borderRadius: "12px",
                    border: "1px solid #fed7aa",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#f97316"
                  strokeWidth={4}
                  dot={{ r: 6, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 10 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Status Breakdown */}
        <ChartCard title="Booking Status Breakdown">
          {bookingStatusData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-slate-500">
              No booking data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={bookingStatusData} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                <XAxis dataKey="status" stroke="#9ca3af" />
                <YAxis allowDecimals={false} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.98)",
                    borderRadius: "12px",
                    border: "1px solid #fed7aa",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="count" radius={[12, 12, 0, 0]} barSize={40}>
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </section>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex justify-center pt-8 md:pt-12"
      >
        <Link
          to="/user-dashboard/bookings"
          className="group flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-orange-600 to-rose-600 text-white shadow-xl hover:shadow-2xl hover:from-orange-700 hover:to-rose-700 transition-all transform hover:-translate-y-1 active:scale-95"
        >
          View All Your Bookings
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Loading / Error States */}
      {loading && (
        <div className="text-center py-20 text-xl text-slate-600">
          Loading your dashboard...
        </div>
      )}

      {error && (
        <div className="text-center py-20 text-xl text-rose-600">
          {error}
        </div>
      )}
    </div>
  );
}