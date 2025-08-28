import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const BottomNavigation = ({ className }) => {
  const navItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/policies", label: "Policies", icon: "Shield" },
    { path: "/claims", label: "Claims", icon: "FileText" },
    { path: "/documents", label: "Documents", icon: "FolderOpen" },
    { path: "/profile", label: "Profile", icon: "User" }
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-glass border-t border-gray-200 z-50",
      className
    )}>
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-200 relative",
              isActive 
                ? "text-primary-600" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" />
                )}
                <ApperIcon 
                  name={item.icon} 
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive ? "scale-110" : "scale-100"
                  )} 
                />
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;