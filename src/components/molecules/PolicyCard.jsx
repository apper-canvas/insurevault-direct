import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const PolicyCard = ({ 
  policy, 
  className,
  onViewDetails,
  onRenew,
  onClaim,
  ...props 
}) => {
  const getAssetIcon = (type) => {
    const icons = {
      car: "Car",
      bike: "Bike",
      home: "Home",
      gadget: "Smartphone",
      travel: "Plane",
      health: "Heart"
    };
    return icons[type] || "Shield";
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { variant: "active", text: "Active" },
      expired: { variant: "expired", text: "Expired" },
      cancelled: { variant: "error", text: "Cancelled" }
    };
    return statusMap[status] || { variant: "default", text: "Unknown" };
  };

  const isExpiringSoon = () => {
    const endDate = new Date(policy.endDate);
    const today = new Date();
    const diffInDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    return diffInDays <= 30 && diffInDays > 0;
  };

  const statusInfo = getStatusBadge(policy.status);

  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 hover:shadow-elevated transition-all duration-300 group",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
            <ApperIcon name={getAssetIcon(policy.asset?.type)} className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{policy.asset?.name}</h3>
            <p className="text-sm text-gray-500">{policy.insurer}</p>
          </div>
        </div>
        <Badge variant={statusInfo.variant}>
          {statusInfo.text}
        </Badge>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Policy Number</span>
          <span className="text-sm font-medium text-gray-900">{policy.policyNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Premium</span>
          <span className="text-sm font-semibold text-gray-900">
            ₹{policy.premium.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Coverage</span>
          <span className="text-sm font-medium text-gray-900">
            ₹{policy.coverageAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Expires</span>
          <span className={cn(
            "text-sm font-medium",
            isExpiringSoon() ? "text-warning" : "text-gray-900"
          )}>
            {format(new Date(policy.endDate), "MMM dd, yyyy")}
          </span>
        </div>
        {policy.ncb > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">NCB</span>
            <Badge variant="success">{policy.ncb}%</Badge>
          </div>
        )}
      </div>

      {isExpiringSoon() && (
        <div className="bg-gradient-to-r from-warning/10 to-yellow-100 border border-warning/20 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="Clock" className="w-4 h-4 text-warning" />
            <p className="text-sm text-warning font-medium">
              Expires in {Math.ceil((new Date(policy.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails?.(policy)}
        >
          View Details
        </Button>
        {policy.status === "active" && (
          <>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => onRenew?.(policy)}
            >
              Renew
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClaim?.(policy)}
            >
              <ApperIcon name="FileText" className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PolicyCard;