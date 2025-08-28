import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      <main className="pb-20 lg:pb-8">
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