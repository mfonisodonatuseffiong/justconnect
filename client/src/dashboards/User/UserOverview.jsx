// src/dashboards/User/UserOverview.jsx
/**
 * @description Overview page for user dashboard
 *              Light theme, orange accents, clean SaaS cards
 */

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/card";
import Button from "../../components/Button";
import {
  CalendarCheck,
  CheckCircle,
  FileText,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "Mon", requests: 3 },
  { name: "Tue", requests: 5 },
  { name: "Wed", requests: 2 },
  { name: "Thu", requests: 8 },
  { name: "Fri", requests: 4 },
  { name: "Sat", requests: 6 },
  { name: "Sun", requests: 5 },
];

const UserOverview = () => {
  const cards = [
    { title: "My Requests", value: 12, Icon: CalendarCheck },
    { title: "Completed", value: 8, Icon: CheckCircle },
    { title: "Appointments", value: 5, Icon: FileText },
    { title: "Messages", value: 2, Icon: MessageCircle },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(({ title, value, Icon }) => (
          <motion.div key={title} whileHover={{ scale: 1.04 }}>
            <Card className="bg-white border border-orange-200 rounded-2xl shadow-sm">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-xl bg-orange-100">
                  <Icon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    {title}
                  </p>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {value}
                  </h2>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Weekly Requests Chart */}
      <Card className="bg-white border border-orange-200 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-orange-600">
            Requests This Week
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link to="/user-dashboard/requests">
          <Button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-5 py-2">
            View Requests <ArrowRight size={16} />
          </Button>
        </Link>

        <Link to="/user-dashboard/appointments">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-orange-400 text-orange-600 hover:bg-orange-50 rounded-xl px-5 py-2"
          >
            View Appointments <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UserOverview;
