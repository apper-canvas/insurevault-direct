import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import Header from "@/components/organisms/Header";
const Layout = () => {
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    { path: "/", icon: "Home", label: "Dashboard" },
    { path: "/policies", icon: "Shield", label: "Policies" },
    { path: "/claims", icon: "FileText", label: "Claims" },
    { path: "/documents", icon: "FolderOpen", label: "Documents" },
    { path: "/payments", icon: "CreditCard", label: "Payments" },
    { path: "/safety", icon: "CheckSquare", label: "Safety" },
    { path: "/recommendations", icon: "Lightbulb", label: "Recommendations" },
    { path: "/add-asset", icon: "Plus", label: "Add Asset" },
    { path: "/emergency", icon: "AlertTriangle", label: "Emergency" },
    { path: "/profile", icon: "User", label: "Profile" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white lg:shadow-lg lg:border-r lg:border-gray-200">
        <div className="flex h-full flex-col pt-16">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex h-full flex-col pt-16">
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigationItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
      
<main className="pb-20 lg:pb-8 lg:pl-64">
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
      
      {/* Floating Emergency Button */}
      <div className="fixed bottom-24 lg:bottom-8 right-4 z-30">
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate("/emergency")}
          className="bg-gradient-to-r from-error to-red-600 hover:from-red-600 hover:to-red-700 shadow-xl hover:shadow-2xl rounded-full w-14 h-14 p-0"
          title="Emergency Assistance"
        >
          <ApperIcon name="AlertTriangle" className="w-6 h-6 text-white" />
        </Button>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;