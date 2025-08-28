import React from "react";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const PolicyCard = ({ 
  policy, 
  className,
  onViewDetails,
  onRenew,
  onClaim,
  onSnooze,
  isComparison = false,
  isSelected = false,
  onSelect,
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
    if (!policy?.endDate) return false;
    try {
      const endDate = new Date(policy.endDate);
      const today = new Date();
      const diffInDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
      return diffInDays <= 30 && diffInDays > 0;
    } catch (error) {
      console.error('Error calculating expiry:', error);
      return false;
    }
  };

  // Ensure policy object exists and has required properties
  if (!policy) {
    return <div className="glass-card rounded-xl p-6 text-center text-gray-500">No policy data available</div>;
  }

  const statusInfo = getStatusBadge(policy.status);
return (
    <div
      className={cn(
        "glass-card rounded-xl p-4 hover:shadow-elevated transition-all duration-300 group",
        isComparison && "cursor-pointer relative",
        isSelected && "ring-2 ring-primary-500 bg-gradient-to-br from-primary-50 to-blue-50",
        className
      )}
      onClick={isComparison ? onSelect : undefined}
      {...props}>
      {isComparison && <div className="absolute top-3 right-3">
        <div
          className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
            isSelected ? "border-primary-500 bg-primary-500 text-white" : "border-gray-300 bg-white"
          )}>
          {isSelected && <ApperIcon name="Check" className="w-3 h-3" />}
        </div>
      </div>}

      {/* Header with icon and title inline */}
<div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
          <ApperIcon
            name={getAssetIcon(policy.asset?.type)}
            className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
<div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-gray-900 text-base leading-tight">
              {policy.asset?.name || policy.assetName || `${policy.type || "Asset"} Insurance`}
            </h3>
            <div className="flex gap-1.5 flex-shrink-0">
              {statusInfo && (
                <Badge variant={statusInfo.variant || "default"} className="text-xs">
                  {statusInfo.text || "Unknown"}
                </Badge>
              )}
              {policy.isQuote && <Badge variant="info" className="text-xs">Quote</Badge>}
            </div>
          </div>
        </div>
      </div>

      {/* Policy details with compact spacing */}
<div className="space-y-3 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Policy Number</span>
          <span className="text-sm font-medium text-gray-900">{policy.policyNumber || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Premium</span>
          <span className="text-sm font-semibold text-gray-900">
            ₹{policy.premium ? policy.premium.toLocaleString() : '0'}
          </span>
        </div>
<div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Coverage</span>
          <span className="text-sm font-medium text-gray-900">
            ₹{policy.coverageAmount ? policy.coverageAmount.toLocaleString() : '0'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Expires</span>
          <span
            className={cn("text-sm font-medium", isExpiringSoon() ? "text-warning" : "text-gray-900")}>
            {policy.endDate ? (() => {
              try {
                return format(new Date(policy.endDate), "MMM dd, yyyy");
              } catch (error) {
                console.error('Date formatting error:', error);
                return 'Invalid Date';
              }
            })() : 'N/A'}
          </span>
        </div>
{policy.ncb && policy.ncb > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">NCB</span>
            <Badge variant="success">{policy.ncb}%</Badge>
          </div>
        )}
      </div>

      {/* Renewal reminder with compact design */}
{isExpiringSoon() && !policy.snoozedUntil && (
        <div className="bg-gradient-to-r from-orange-50 via-yellow-50 to-amber-50 border border-orange-200 rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ApperIcon name="Clock" className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm text-warning font-semibold">Renewal Reminder</p>
                <p className="text-sm text-warning/80">
                  Expires in {(() => {
                    try {
                      return Math.ceil((new Date(policy.endDate) - new Date()) / (1000 * 60 * 60 * 24));
                    } catch (error) {
                      return 'N/A';
                    }
                  })()} days
                </p>
              </div>
            </div>
<div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-warning hover:bg-warning/10 p-2"
                onClick={() => onSnooze?.(policy)}>
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
              <Button variant="success" size="sm" className="px-3" onClick={() => onRenew?.(policy)}>
                Renew
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons with compact design */}
{!isComparison && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-primary-300 text-primary-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 text-sm px-4"
            onClick={() => onViewDetails?.(policy)}>
            View Details
          </Button>
          {policy.status === "active" && (
            <>
<Button
                variant="primary"
                size="sm"
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md text-sm px-4"
                onClick={() => onRenew?.(policy)}>
                <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                Renew
              </Button>
              <Button
                variant="ghost"
                size="sm"
className="text-accent-600 hover:bg-accent-50 hover:text-accent-700 p-2.5"
                onClick={() => window.location.href = "/safety"}
                title="View safety checklist">
                <ApperIcon name="ShieldCheck" className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-secondary-600 hover:bg-secondary-50 hover:text-secondary-700 p-2.5"
                onClick={() => onClaim?.(policy)}>
                <ApperIcon name="FileText" className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      )}

      {/* Comparison mode footer */}
      {isComparison && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">
              {isSelected ? "Selected for comparison" : "Click to compare"}
            </span>
            <Button
              variant={isSelected ? "primary" : "outline"}
              size="sm"
              className="text-xs"
              onClick={e => {
                e.stopPropagation();
                onSelect?.();
              }}>
              {isSelected ? (
                <>
                  <ApperIcon name="Check" className="w-3 h-3 mr-1" />
                  Selected
                </>
              ) : (
                <>
                  <ApperIcon name="Plus" className="w-3 h-3 mr-1" />
                  Compare
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
);
};

export default PolicyCard;