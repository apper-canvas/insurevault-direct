import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  className, 
  message = "Something went wrong", 
  onRetry,
  showRetry = true,
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)} {...props}>
      <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;