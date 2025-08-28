import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      <main className="pb-20 lg:pb-8">
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;