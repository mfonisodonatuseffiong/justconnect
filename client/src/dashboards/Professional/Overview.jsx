/**
 * @description Professional dashboard overview page
 *              - Shows KPIs (bookings, pending, completed, earnings)
 *              - Displays weekly bookings graph
 *              - Lists recent bookings
 *              - Provides quick links to services and bookings
 */

import { Card, CardContent, CardHeader, CardTitle } from "./components/card";
import Button from "./components/Button";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion as Motion } from "framer-motion";
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  Wallet,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const data = [
  { name: "Mon", bookings: 3 },
  { name: "Tue", bookings: 6 },
  { name: "Wed", bookings: 2 },
  { name: "Thu", bookings: 8 },
  { name: "Fri", bookings: 5 },
  { name: "Sat", bookings: 7 },
  { name: "Sun", bookings: 4 },
];

const Overview = () => {
  return (
    <div className="md:p-6 space-y-6">
      {/* Header */}
      <Motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-orange-600">Overview</h1>
          <p className="text-rose-600">
            Here’s how your business is performing today.
          </p>
        </div>
      </Motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="rounded-2xl shadow-sm border border-amber-200">
          <CardContent className="flex items-center gap-4 p-6">
            <CalendarCheck className="w-10 h-10 text-orange-600" />
            <div>
              <p className="text-rose-600 mt-2 text-sm">Total Bookings</p>
              <h2 className="text-2xl font-bold text-amber-700">128</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border border-amber-200">
          <CardContent className="flex items-center gap-4 p-6">
            <Clock className="w-10 h-10 text-amber-500" />
            <div>
              <p className="text-rose-600 mt-2 text-sm">Pending</p>
              <h2 className="text-2xl font-bold text-amber-700">0</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border border-amber-200">
          <CardContent className="flex items-center gap-4 p-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
            <div>
              <p className="text-rose-600 mt-2 text-sm">Completed</p>
              <h2 className="text-2xl font-bold text-amber-700">96</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border border-amber-200">
          <CardContent className="flex items-center gap-4 p-6">
            <Wallet className="w-10 h-10 text-orange-600" />
            <div>
              <p className="text-rose-600 mt-2 text-sm">Earnings</p>
              <h2 className="text-2xl font-bold text-amber-700">₦245,000</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart */}
      <Card className="rounded-2xl shadow-sm border border-amber-200">
        <CardHeader>
          <CardTitle className="text-orange-600">Bookings This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <XAxis dataKey="name" stroke="#F59E0B" /> {/* amber-500 */}
                <YAxis stroke="#F59E0B" />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#F97316" strokeWidth={2} /> {/* orange-600 */}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card className="rounded-2xl shadow-sm border border-amber-200">
        <CardHeader>
          <CardTitle className="text-orange-600">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between border-b border-rose-200 border-dashed pb-3"
              >
                <div>
                  <p className="font-medium text-amber-700">John Doe</p>
                  <p className="text-sm text-rose-600">
                    Plumbing Service • 2 Feb 2025
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link to={"services"}>
          <Button className="rounded-xl flex items-center gap-2 bg-orange-600 text-white hover:bg-orange-700">
            <Plus size={18} /> Add Service
          </Button>
        </Link>

        <Link to={"bookings"}>
          <Button
            variant="outline"
            className="rounded-xl flex items-center gap-2 border-amber-600 text-amber-600 hover:bg-amber-50"
          >
            View Bookings <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Overview;
