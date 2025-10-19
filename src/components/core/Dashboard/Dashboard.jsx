import React from "react";
import Sidebar from "../../core/Dashboard/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar fixed on the left */}
      <div className="lg:w-[220px] h-full sticky top-0">
        <Sidebar />
      </div>

      {/* Right content area scrollable */}
      <div className="flex-1 overflow-auto">
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
