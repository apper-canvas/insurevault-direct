import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const BottomNavigation = () => {
  const navItems = [
    { path: "/", icon: "Home", label: "Home" },
    { path: "/policies", icon: "Shield", label: "Policies" },
    { path: "/claims", icon: "FileText", label: "Claims" },
    { path: "/payments", icon: "CreditCard", label: "Payments" },
    { path: "/profile", icon: "User", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 lg:hidden">
<div className="flex items-center justify-around max-w-md mx-auto">
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