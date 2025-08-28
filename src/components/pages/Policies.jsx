import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PolicyList from "@/components/organisms/PolicyList";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const Policies = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const assetTypes = [
    { value: "all", label: "All Types", icon: "Grid" },
    { value: "car", label: "Car", icon: "Car" },
    { value: "bike", label: "Bike", icon: "Bike" },
    { value: "home", label: "Home", icon: "Home" },
    { value: "gadget", label: "Gadget", icon: "Smartphone" },
    { value: "travel", label: "Travel", icon: "Plane" },
    { value: "health", label: "Health", icon: "Heart" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Policies</h1>
            <p className="text-gray-600">Manage all your insurance policies in one place</p>
          </div>
          <Button variant="primary" onClick={() => navigate("/add-asset")}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add New Policy
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search policies by name, insurer, or policy number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {assetTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilterType(type.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  filterType === type.value
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ApperIcon name={type.icon} className="w-4 h-4" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Policy Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="Shield" className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-2xl font-bold gradient-text">5</p>
          <p className="text-sm text-gray-600">Active Policies</p>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-accent-600" />
          </div>
          <p className="text-2xl font-bold gradient-text">₹25L</p>
          <p className="text-sm text-gray-600">Total Coverage</p>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-warning/20 to-warning/30 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="Clock" className="w-5 h-5 text-warning" />
          </div>
          <p className="text-2xl font-bold text-warning">2</p>
          <p className="text-sm text-gray-600">Expiring Soon</p>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="PiggyBank" className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">₹15K</p>
          <p className="text-sm text-gray-600">Annual Savings</p>
        </div>
      </div>

      {/* Policies List */}
      <PolicyList searchTerm={searchTerm} filterType={filterType} showHeader={false} />
    </div>
  );
};

export default Policies;