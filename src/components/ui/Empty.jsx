import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className,
  title = "No data found",
  description = "There's nothing here yet.",
  action,
  actionText = "Get Started",
  icon = "Package",
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)} {...props}>
      <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
        {action && (
<button
            onClick={action}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;