import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const ClaimCard = ({ 
  claim,
  onViewDetails,
  onTrackStatus,
  className,
  ...props 
}) => {
  const getStatusConfig = (status) => {
    const configs = {
      filed: { variant: "pending", icon: "FileText", color: "text-yellow-600" },
      processing: { variant: "primary", icon: "Clock", color: "text-blue-600" },
      approved: { variant: "success", icon: "CheckCircle", color: "text-green-600" },
      settled: { variant: "success", icon: "CheckCircle2", color: "text-green-600" },
      rejected: { variant: "error", icon: "XCircle", color: "text-red-600" }
    };
    return configs[status] || configs.filed;
  };

  const statusConfig = getStatusConfig(claim.status);

  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 hover:shadow-elevated transition-all duration-300",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">
            Claim #{claim.claimNumber || claim.id}
          </h3>
          <p className="text-sm text-gray-500">{claim.type}</p>
        </div>
        <Badge variant={statusConfig.variant}>
          <ApperIcon name={statusConfig.icon} className="w-3 h-3 mr-1" />
          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
        </Badge>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Filed Date</span>
          <span className="text-sm font-medium text-gray-900">
            {format(new Date(claim.filedDate), "MMM dd, yyyy")}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Claim Amount</span>
          <span className="text-sm font-semibold text-gray-900">
            ₹{claim.amount.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Policy</span>
          <span className="text-sm font-medium text-gray-900">
            {claim.policyNumber || "POL123456"}
          </span>
        </div>
      </div>

      {claim.description && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{claim.description}</p>
        </div>
      )}

      {/* Status Timeline Preview */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <ApperIcon name="Activity" className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Status Timeline</span>
        </div>
        
        <div className="space-y-2">
          {(claim.timeline || [
            { status: "Filed", date: claim.filedDate, completed: true },
            { status: "Processing", date: null, completed: claim.status !== "filed" },
            { status: "Approved", date: null, completed: ["approved", "settled"].includes(claim.status) },
            { status: "Settled", date: null, completed: claim.status === "settled" }
          ]).slice(0, 2).map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full",
                step.completed ? "bg-primary-500" : "bg-gray-300"
              )} />
              <span className={cn(
                "text-sm",
                step.completed ? "text-gray-900" : "text-gray-500"
              )}>
                {step.status}
              </span>
              {step.date && (
                <span className="text-xs text-gray-400 ml-auto">
                  {format(new Date(step.date), "MMM dd")}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails?.(claim)}
        >
          View Details
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onTrackStatus?.(claim)}
        >
          Track Status
        </Button>
      </div>
    </div>
  );
};

export default ClaimCard;