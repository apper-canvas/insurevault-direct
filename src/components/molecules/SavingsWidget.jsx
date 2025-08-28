import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { savingsCalculatorService } from "@/services/api/savingsCalculatorService";

const SavingsWidget = ({ className, ...props }) => {
  const [savingsData, setSavingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    loadSavingsData();
  }, []);

  const loadSavingsData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await savingsCalculatorService.calculateSavings();
      setSavingsData(data);
    } catch (err) {
      setError("Failed to calculate savings. Please try again.");
      toast.error("Failed to load savings data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={cn("p-6 animate-pulse", className)} {...props}>
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </Card>
    );
  }

  if (error || !savingsData) {
    return (
      <Card className={cn("p-6", className)} {...props}>
        <div className="flex items-center gap-3 text-error">
          <ApperIcon name="AlertCircle" className="w-5 h-5" />
          <span className="text-sm">{error || "Unable to calculate savings"}</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("glass-card rounded-xl p-6 hover:shadow-elevated transition-all duration-300", className)} {...props}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold gradient-text mb-1">Multi-Policy Savings</h3>
          <p className="text-sm text-gray-600">Your total annual savings breakdown</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg flex items-center justify-center">
          <ApperIcon name="PiggyBank" className="w-6 h-6 text-accent-600" />
        </div>
      </div>

      {/* Main Savings Display */}
      <div className="mb-4">
        <div className="text-3xl font-bold gradient-text mb-1">
          ₹{savingsData.totalSavings.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ApperIcon name="TrendingUp" className="w-4 h-4 text-accent-600" />
          <span className="font-medium text-accent-600">
            {savingsData.savingsPercentage.toFixed(1)}% saved
          </span>
          <span className="text-gray-500">vs individual policies</span>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-3">
          <div className="text-sm text-gray-600 mb-1">Active Policies</div>
          <div className="text-lg font-semibold text-primary-600">
            {savingsData.policyCount}
          </div>
        </div>
        <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg p-3">
          <div className="text-sm text-gray-600 mb-1">Monthly Savings</div>
          <div className="text-lg font-semibold text-accent-600">
            ₹{Math.round(savingsData.totalSavings / 12).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Breakdown Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="w-full justify-between text-primary-600 hover:bg-primary-50"
      >
        <span className="font-medium">
          {showBreakdown ? "Hide" : "Show"} Savings Breakdown
        </span>
        <ApperIcon 
          name={showBreakdown ? "ChevronUp" : "ChevronDown"} 
          className="w-4 h-4" 
        />
      </Button>

      {/* Detailed Breakdown */}
      {showBreakdown && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 animate-slide-up">
          {savingsData.breakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  item.type === "multi-policy" && "bg-primary-500",
                  item.type === "loyalty" && "bg-secondary-500", 
                  item.type === "bundle" && "bg-accent-500",
                  item.type === "ncb" && "bg-warning"
                )}>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  ₹{item.amount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">{item.percentage}%</div>
              </div>
            </div>
          ))}
          
          {/* Call to Action */}
          <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="Lightbulb" className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-900">Optimization Tip</span>
            </div>
            <p className="text-xs text-gray-600">
              {savingsData.tip}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SavingsWidget;