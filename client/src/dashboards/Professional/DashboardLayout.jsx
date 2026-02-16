/**
 * @description Main entry for the professional dashboard
 *              Provides the dashboard shell with sidebar + navbar
 *              and renders nested routes via <Outlet />
 */
import { Outlet } from "react-router-dom";
import AsideBar from "./components/AsideBar";
import Navbar from "./components/Navbar";

const DashboardLayout = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-white text-slate-800">
      {/* Sidebar */}
      <AsideBar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 bg-rose-50">
          <div className="h-full w-full rounded-xl border border-amber-200 bg-white shadow-sm p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
