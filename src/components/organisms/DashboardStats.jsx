import React from "react";
import StatsCard from "@/components/molecules/StatsCard";

const DashboardStats = ({ stats, className }) => {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <StatsCard
        title="Active Policies"
        value={stats?.activePolicies || "5"}
        subtitle="2 expiring soon"
        icon="Shield"
        trend={{ direction: "up", percentage: "12", period: "this month" }}
      />
      
      <StatsCard
        title="Total Coverage"
        value={`₹${((stats?.totalCoverage || 2500000) / 100000).toFixed(1)}L`}
        subtitle="Across all assets"
        icon="TrendingUp"
      />
      
      <StatsCard
        title="Active Claims"
        value={stats?.activeClaims || "2"}
        subtitle="1 pending approval"
        icon="FileText"
        trend={{ direction: "down", percentage: "5", period: "vs last month" }}
      />
      
      <StatsCard
        title="Annual Savings"
        value={`₹${(stats?.annualSavings || 15000).toLocaleString()}`}
        subtitle="Multi-policy discount"
        icon="PiggyBank"
        trend={{ direction: "up", percentage: "8", period: "this year" }}
      />
    </div>
  );
};

export default DashboardStats;