import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClaimsList from "@/components/organisms/ClaimsList";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const Claims = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const statusFilters = [
    { value: "all", label: "All Claims", icon: "List" },
    { value: "filed", label: "Filed", icon: "FileText" },
    { value: "processing", label: "Processing", icon: "Clock" },
    { value: "approved", label: "Approved", icon: "CheckCircle" },
    { value: "settled", label: "Settled", icon: "CheckCircle2" },
    { value: "rejected", label: "Rejected", icon: "XCircle" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
<div className="glass-card rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Claims</h1>
            <p className="text-gray-600">Track and manage your insurance claims</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/emergency")}
              className="border-error text-error hover:bg-error hover:text-white"
            >
              <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-2" />
              Emergency Assistance
            </Button>
            <Button variant="primary" onClick={() => navigate("/claims/new")}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              File New Claim
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search claims by number, type, or policy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {statusFilters.map((status) => (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  filterStatus === status.value
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ApperIcon name={status.icon} className="w-4 h-4" />
                <span className="text-sm font-medium">{status.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Claims Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="FileText" className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-2xl font-bold gradient-text">7</p>
          <p className="text-sm text-gray-600">Total Claims</p>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-warning/20 to-warning/30 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="Clock" className="w-5 h-5 text-warning" />
          </div>
          <p className="text-2xl font-bold text-warning">2</p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="CheckCircle" className="w-5 h-5 text-accent-600" />
          </div>
          <p className="text-2xl font-bold text-accent-600">4</p>
          <p className="text-sm text-gray-600">Approved</p>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="IndianRupee" className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">₹2.5L</p>
          <p className="text-sm text-gray-600">Total Settled</p>
        </div>
      </div>

      {/* Claim Process Guide */}
      <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Info" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How to File a Claim</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium text-xs">1</div>
                <span>Report incident immediately</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium text-xs">2</div>
                <span>Upload photos & documents</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium text-xs">3</div>
                <span>Track status in real-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Claims List */}
      <ClaimsList searchTerm={searchTerm} filterStatus={filterStatus} showHeader={false} />
    </div>
  );
};

export default Claims;