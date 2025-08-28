import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuToggle }) => {
  const location = useLocation();
  const [notifications] = useState([
    { id: 1, title: "Policy Renewal Due", message: "Your car insurance expires in 15 days", type: "warning" },
    { id: 2, title: "Claim Update", message: "Your health claim has been approved", type: "success" },
    { id: 3, title: "New Discount Available", message: "Get 20% off on multi-policy purchase", type: "info" }
  ]);
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path.includes("/policies")) return "My Policies";
    if (path.includes("/claims")) return "Claims";
    if (path.includes("/documents")) return "Documents";
    if (path.includes("/profile")) return "Profile";
    if (path.includes("/add-asset")) return "Add New Asset";
    return "InsureVault";
  };

  return (
    <header className="bg-white/80 backdrop-blur-glass border-b border-gray-100 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuToggle}
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          
          {/* Logo & Title */}
<div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Shield" className="w-5 h-5 text-white" />
            </div>
            <div className="block">
              <h1 className="text-lg sm:text-xl font-bold gradient-text">InsureVault</h1>
              <p className="text-xs sm:text-sm text-gray-500 -mt-1 hidden sm:block">{getPageTitle()}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative group">
            <Button variant="ghost" size="sm" className="relative">
              <ApperIcon name="Bell" className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>
            
            {/* Notifications Dropdown */}
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-elevated border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                    <div className="flex gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === "success" ? "bg-accent-500" :
                        notification.type === "warning" ? "bg-warning" :
                        "bg-primary-500"
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                        <p className="text-gray-600 text-xs mt-1">{notification.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="w-full text-primary-600">
                  View All Notifications
                </Button>
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="relative group">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
<ApperIcon name="User" className="w-4 h-4 text-gray-600" />
              </div>
              <span className="hidden sm:block font-medium text-gray-700">John Doe</span>
            </Button>
            {/* Profile Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-elevated border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <ApperIcon name="User" className="w-4 h-4 mr-2" />
                  Profile Settings
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <ApperIcon name="Settings" className="w-4 h-4 mr-2" />
                  Preferences
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <ApperIcon name="HelpCircle" className="w-4 h-4 mr-2" />
                  Help & Support
                </Button>
                <div className="border-t border-gray-100 my-1" />
                <Button variant="ghost" size="sm" className="w-full justify-start text-error">
                  <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;