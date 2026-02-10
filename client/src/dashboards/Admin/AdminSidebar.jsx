import { Link } from "react-router-dom";
import { Users, Briefcase, BarChart3 } from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg border-r border-orange-200">
      <div className="p-6 text-2xl font-bold text-orange-600">Admin Panel</div>
      <nav className="flex flex-col gap-2 px-4">
        <Link to="/admin" className="flex items-center gap-2 p-3 rounded hover:bg-orange-100">
          <BarChart3 /> Dashboard
        </Link>
        <Link to="/admin/professionals" className="flex items-center gap-2 p-3 rounded hover:bg-orange-100">
          <Briefcase /> Professionals
        </Link>
        <Link to="/admin/users" className="flex items-center gap-2 p-3 rounded hover:bg-orange-100">
          <Users /> Users
        </Link>
      </nav>
    </aside>
  );
}
