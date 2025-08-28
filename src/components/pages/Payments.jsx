import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentHistory from "@/components/organisms/PaymentHistory";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const Payments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const statusFilters = [
    { value: "all", label: "All Payments", icon: "CreditCard" },
    { value: "paid", label: "Paid", icon: "CheckCircle" },
    { value: "pending", label: "Pending", icon: "Clock" },
    { value: "overdue", label: "Overdue", icon: "AlertTriangle" },
    { value: "upcoming", label: "Upcoming", icon: "Calendar" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Center</h1>
            <p className="text-gray-600">Track premium payments and manage upcoming dues</p>
          </div>
          <Button variant="primary" onClick={() => navigate("/policies")}>
            <ApperIcon name="Shield" className="w-4 h-4 mr-2" />
            View Policies
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search payments by policy number, insurer, or amount..."
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

      {/* Payment Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">12</p>
          <p className="text-sm text-gray-600">Paid This Year</p>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-warning/20 to-warning/30 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="Clock" className="w-5 h-5 text-warning" />
          </div>
          <p className="text-2xl font-bold text-warning">2</p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">1</p>
          <p className="text-sm text-gray-600">Overdue</p>
        </div>
        
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ApperIcon name="PiggyBank" className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-2xl font-bold gradient-text">₹58K</p>
          <p className="text-sm text-gray-600">Total Paid</p>
        </div>
      </div>

      {/* Payment History */}
      <PaymentHistory searchTerm={searchTerm} filterStatus={filterStatus} />
    </div>
  );
};

export default Payments;