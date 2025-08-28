import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardStats from "@/components/organisms/DashboardStats";
import PolicyList from "@/components/organisms/PolicyList";
import ClaimsList from "@/components/organisms/ClaimsList";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { dashboardService } from "@/services/api/dashboardService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboard} />;
  }

  const upcomingRenewals = [
    { id: 1, name: "Honda City Insurance", insurer: "HDFC ERGO", daysLeft: 15, type: "car" },
    { id: 2, name: "Home Insurance", insurer: "ICICI Lombard", daysLeft: 42, type: "home" },
    { id: 3, name: "Health Insurance", insurer: "Max Bupa", daysLeft: 78, type: "health" }
  ];

  const quickActions = [
    {
      title: "Add New Policy",
      description: "Protect a new asset",
      icon: "Plus",
      color: "from-primary-500 to-primary-600",
      action: () => navigate("/add-asset")
    },
    {
      title: "File a Claim",
      description: "Report an incident",
      icon: "FileText",
      color: "from-orange-500 to-red-500",
      action: () => navigate("/claims/new")
    },
    {
      title: "Renew Policy",
      description: "Extend coverage",
      icon: "RefreshCw",
      color: "from-green-500 to-emerald-500",
      action: () => navigate("/policies")
    },
    {
      title: "24/7 Support",
      description: "Get help anytime",
      icon: "MessageCircle",
      color: "from-purple-500 to-violet-500",
      action: () => navigate("/support")
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass-card rounded-xl p-6 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, John! 👋
            </h1>
            <p className="text-gray-600">
              Your insurance portfolio is looking strong. Here's what needs your attention.
            </p>
          </div>
          <Button 
            variant="primary"
            onClick={() => navigate("/add-asset")}
            className="hidden sm:flex"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Policy
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <DashboardStats stats={dashboardData?.stats} />

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="glass-card rounded-xl p-4 text-left hover:shadow-elevated transition-all duration-300 group"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <ApperIcon name={action.icon} className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Renewals */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Renewals</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/policies")}>
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {upcomingRenewals.map((renewal) => (
            <div key={renewal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                  <ApperIcon 
                    name={renewal.type === "car" ? "Car" : renewal.type === "home" ? "Home" : "Heart"} 
                    className="w-5 h-5 text-primary-600" 
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{renewal.name}</p>
                  <p className="text-sm text-gray-500">{renewal.insurer}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={renewal.daysLeft <= 30 ? "warning" : "default"}>
                  {renewal.daysLeft} days left
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Policies */}
      <PolicyList limit={3} showHeader={false} />

      {/* Recent Claims */}
      <ClaimsList limit={2} showHeader={false} />

      {/* Safety Tips */}
      <Card className="bg-gradient-to-br from-accent-50 to-green-50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Lightbulb" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">💡 Safety Tip of the Day</h3>
            <p className="text-gray-700 mb-3">
              Regular vehicle maintenance can help prevent accidents and reduce your insurance premium. 
              Keep your maintenance records updated for better claim processing.
            </p>
            <Button variant="ghost" size="sm" className="text-accent-600">
              <ApperIcon name="ExternalLink" className="w-4 h-4 mr-2" />
              View Safety Checklist
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;