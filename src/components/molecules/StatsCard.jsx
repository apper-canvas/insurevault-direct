import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const StatsCard = ({ 
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 hover:shadow-elevated transition-all duration-300",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold gradient-text mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
            <ApperIcon name={icon} className="w-5 h-5 text-primary-600" />
          </div>
        )}
      </div>
      
      {trend && (
        <div className="flex items-center gap-1 mt-3">
          <ApperIcon 
            name={trend.direction === "up" ? "TrendingUp" : "TrendingDown"} 
            className={cn(
              "w-4 h-4",
              trend.direction === "up" ? "text-accent-600" : "text-error"
            )} 
          />
          <span className={cn(
            "text-sm font-medium",
            trend.direction === "up" ? "text-accent-600" : "text-error"
          )}>
            {trend.percentage}%
          </span>
          <span className="text-sm text-gray-500">{trend.period}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;