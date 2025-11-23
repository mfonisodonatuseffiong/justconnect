/**
 * @description This serves as the main entry for the professional dashboard
 *              This returns a Dashboard layer while outlet displays all nav links
 */
import { Outlet } from "react-router-dom";
import AsideBar from "./components/AsideBar";
import Navbar from "./components/Navbar";

const DashboardLayout = () => {
  return (
    <div className="h-screen p-4 flex overflow-hidden text-black">
      <AsideBar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
