// src/dashboards/User/UserOverview.jsx
/**
 * @description Overview page for user dashboard
 *              Dark-themed cards, orange icons, bold black text
 */

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card";
import Button from "../../components/Button";
import { CalendarCheck, CheckCircle, FileText, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Mon", requests: 3 },
  { name: "Tue", requests: 5 },
  { name: "Wed", requests: 2 },
  { name: "Thu", requests: 8 },
  { name: "Fri", requests: 4 },
  { name: "Sat", requests: 6 },
  { name: "Sun", requests: 5 },
];

const ICON_COLOR = "text-orange-500";

const UserOverview = () => {
  const cards = [
    { title: "My Requests", value: 12, Icon: CalendarCheck },
    { title: "Completed", value: 8, Icon: CheckCircle },
    { title: "Appointments", value: 5, Icon: FileText },
    { title: "Messages", value: 2, Icon: MessageCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Motion KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <motion.div key={card.title} whileHover={{ scale: 1.03 }}>
            <Card className="bg-black text-black">
              <CardContent className="flex items-center gap-4">
                <card.Icon className={`w-8 h-8 ${ICON_COLOR} transition-transform duration-300 hover:scale-125`} />
                <div>
                  <p className="text-sm font-bold">{card.title}</p>
                  <h2 className="text-xl font-bold">{card.value}</h2>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Line Chart */}
      <Card className="bg-black text-black">
        <CardHeader>
          <CardTitle className="font-bold">Requests This Week</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#000" />
              <YAxis stroke="#000" />
              <Tooltip />
              <Line type="monotone" dataKey="requests" stroke="#F97316" strokeWidth={2} /> {/* orange line */}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link to="/user-dashboard/requests">
          <Button className="flex items-center gap-2 rounded-lg bg-black text-black border border-orange-500 hover:bg-gray-800 hover:text-orange-500">
            View Requests <ArrowRight size={16} className={ICON_COLOR} />
          </Button>
        </Link>

        <Link to="/user-dashboard/appointments">
          <Button variant="outline" className="flex items-center gap-2 rounded-lg border border-orange-500 text-black hover:bg-gray-800 hover:text-orange-500">
            View Appointments <ArrowRight size={16} className={ICON_COLOR} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UserOverview;
