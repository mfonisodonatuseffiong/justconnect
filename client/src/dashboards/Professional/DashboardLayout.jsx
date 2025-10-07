/**
 * @description This serves as the main entry for the professional dashboard
 *              This returns a Dashboard layer while outlet displays all nav links
 */
import { Outlet } from "react-router-dom";
import AsideBar from "./components/AsideBar";
import Navbar from "./components/Navbar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col text-accent">
      {/** Navbar  */}
      <Navbar />

      {/** aside + main content */}
      <div className="flex flex-1">
        <AsideBar />

        <main className="flex-1 overflow-y-auto p-6 rounded-tl-2xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
