import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { getDashboardStats } from "./adminService";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    users: 0,
    professionals: 0,
    chartData: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res || { users: 0, professionals: 0, chartData: [] });
      } catch (err) {
        console.error("❌ Failed to fetch dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ✅ Added heading so tests can find it */}
      <h1 className="text-2xl font-bold text-slate-800 md:col-span-2">
        Admin Dashboard
      </h1>

      {/* Users card */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
        <h2 className="text-lg font-bold text-slate-700">Total Users</h2>
        <p className="text-3xl font-extrabold text-orange-600">{stats.users}</p>
      </div>

      {/* Professionals card */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
        <h2 className="text-lg font-bold text-slate-700">Total Professionals</h2>
        <p className="text-3xl font-extrabold text-orange-600">
          {stats.professionals}
        </p>
      </div>

      {/* Chart section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200 md:col-span-2">
        <h2 className="text-lg font-bold text-slate-700 mb-4">
          Activity Overview
        </h2>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.chartData}>
              <CartesianGrid stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#f97316"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="professionals"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
