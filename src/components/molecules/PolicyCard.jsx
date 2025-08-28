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
        isComparison && "cursor-pointer relative",
        isSelected && "ring-2 ring-primary-500 bg-gradient-to-br from-primary-50 to-blue-50",
        className
    )}
    onClick={isComparison ? onSelect : undefined}
    {...props}>
    {isComparison && <div className="absolute top-4 right-4">
        <div
            className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                isSelected ? "border-primary-500 bg-primary-500 text-white" : "border-gray-300 bg-white"
            )}>
            {isSelected && <ApperIcon name="Check" className="w-4 h-4" />}
        </div>
    </div>}
    <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
<div
                className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                <ApperIcon
                    name={getAssetIcon(policy.asset?.type)}
                    className="w-6 h-6 text-primary-600" />
            </div>
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                        {policy.asset?.name || policy.assetName || `${policy.type || "Asset"} Insurance`}
                    </h3>
                    <div className="flex gap-2">
                        <Badge variant={statusInfo.variant}>
                            {statusInfo.text}
                        </Badge>
                        {policy.isQuote && <Badge variant="info" className="text-xs">Quote</Badge>}
                    </div>
                </div>
                
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Policy Number</span>
                        <span className="text-sm font-medium text-gray-900">{policy.policyNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Premium</span>
                        <span className="text-sm font-semibold text-gray-900">₹{policy.premium?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Coverage</span>
                        <span className="text-sm font-medium text-gray-900">₹{policy.coverageAmount?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Expires</span>
                        <span
                            className={cn("text-sm font-medium", isExpiringSoon() ? "text-warning" : "text-gray-900")}>
                            {policy.endDate ? format(new Date(policy.endDate), "MMM dd, yyyy") : 'N/A'}
                        </span>
                    </div>
                    {policy.ncb > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">NCB</span>
                            <Badge variant="success">{policy.ncb}%</Badge>
                        </div>
                    )}
                </div>
                
                {isExpiringSoon() && !policy.snoozedUntil && (
                    <div className="bg-gradient-to-r from-warning/10 to-yellow-100 border border-warning/20 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ApperIcon name="Clock" className="w-5 h-5 text-warning" />
                                <div>
                                    <p className="text-sm text-warning font-semibold">Renewal Reminder</p>
                                    <p className="text-xs text-warning/80">
                                        Expires in {Math.ceil((new Date(policy.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-warning hover:bg-warning/10"
                                    onClick={() => onSnooze?.(policy)}>
                                    <ApperIcon name="X" className="w-4 h-4" />
                                </Button>
                                <Button variant="success" size="sm" onClick={() => onRenew?.(policy)}>
                                    Renew Now
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                
                {!isComparison && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => onViewDetails?.(policy)}>
                            View Details
                        </Button>
                        {policy.status === "active" && (
                            <>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => onRenew?.(policy)}>
                                    <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                                    Renew
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.location.href = "/safety"}
                                    title="View safety checklist">
                                    <ApperIcon name="ShieldCheck" className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => onClaim?.(policy)}>
                                    <ApperIcon name="FileText" className="w-4 h-4" />
                                </Button>
                            </>
                        )}
                    </div>
                )}
                
                {isComparison && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                {isSelected ? "Selected for comparison" : "Click to compare"}
                            </span>
                            <Button
                                variant={isSelected ? "primary" : "outline"}
                                size="sm"
                                onClick={e => {
                                    e.stopPropagation();
                                    onSelect?.();
                                }}>
                                {isSelected ? (
                                    <>
                                        <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                                        Selected
                                    </>
                                ) : (
                                    <>
                                        <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                                        Compare
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
</div>
};

export default PolicyCard;