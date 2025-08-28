import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SafetyChecklistsOrg from "@/components/organisms/SafetyChecklists";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import StatsCard from "@/components/molecules/StatsCard";

const SafetyChecklists = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const assetTypes = [
    { value: "all", label: "All Assets", icon: "Shield" },
    { value: "car", label: "Car", icon: "Car" },
    { value: "bike", label: "Bike", icon: "Bike" },
    { value: "home", label: "Home", icon: "Home" },
    { value: "gadget", label: "Gadget", icon: "Smartphone" },
    { value: "health", label: "Health", icon: "Heart" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Safety Checklists</h1>
            <p className="text-gray-600">Reduce risks and stay protected with personalized safety tips</p>
          </div>
          <Button variant="primary" onClick={() => navigate("/policies")}>
            <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
            View Policies
          </Button>
        </div>
      </div>

      {/* Safety Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Completed Tasks"
          value="12"
          subtitle="This month"
          icon="CheckCircle"
          trend={{ direction: "up", percentage: 15, period: "vs last month" }}
        />
        
        <StatsCard
          title="Risk Score"
          value="85%"
          subtitle="Excellent"
          icon="Shield"
          trend={{ direction: "up", percentage: 8, period: "improved" }}
        />
        
        <StatsCard
          title="Active Checklists"
          value="5"
          subtitle="In progress"
          icon="List"
        />
        
        <StatsCard
          title="Safety Tips"
          value="24"
          subtitle="Available"
          icon="Lightbulb"
        />
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search safety tips and checklists..."
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

      {/* Safety Checklists */}
      <SafetyChecklistsOrg searchTerm={searchTerm} filterType={filterType} />
    </div>
  );
};

export default SafetyChecklists;