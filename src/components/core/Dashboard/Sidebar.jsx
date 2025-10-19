import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { sidebarLinks } from "../../../data/dashboard-links";
import * as VscIcons from "react-icons/vsc";
import * as RiIcons from "react-icons/ri";
import * as FaIcons from "react-icons/fa";

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  const getIconComponent = (iconName) =>
    VscIcons[iconName] ||
    RiIcons[iconName] ||
    FaIcons[iconName] ||
    (() => <span>🔗</span>);

  const filteredLinks = sidebarLinks.filter(
    (link) => !link.type || link.type === user?.accountType
  );

  return (
    <div className="w-10 md:w-35 lg:min-w-[240px] min-h-screen bg-[#195A00] text-white flex flex-col pt-10">
      {/* <h2 className="text-xl font-semibold text-center mb-8">Foodi Dashboard</h2> */}

      <div className="flex flex-col">
        {filteredLinks.map((link) => {
          const Icon = getIconComponent(link.icon);
          return (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                `px-2 lg:px-8 py-3 flex items-center gap-x-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-yellow-400 text-white"
                    : "text-gray-200 hover:bg-[#2c333f]/60"
                }`
              }
              end
            >
              <Icon className="lg:text-lg" />
              <p className="hidden md:block">{`${link.name}`}</p>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
