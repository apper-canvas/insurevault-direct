import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default", ...props }) => {
  if (variant === "cards") {
    return (
<div className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6", className)} {...props}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="glass-card rounded-xl p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="skeleton w-12 h-12 sm:w-14 sm:h-14 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="skeleton h-5 w-3/4 rounded"></div>
                <div className="skeleton h-4 w-1/2 rounded"></div>
                <div className="flex gap-2">
                  <div className="skeleton h-6 w-16 rounded-full"></div>
                  <div className="skeleton h-6 w-20 rounded-full"></div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="skeleton h-3 w-full rounded"></div>
                  <div className="skeleton h-3 w-2/3 rounded"></div>
                </div>
              </div>
              <div className="flex gap-1">
                <div className="skeleton w-8 h-8 rounded-lg"></div>
                <div className="skeleton w-8 h-8 rounded-lg"></div>
              </div>
            </div>
            <div className="skeleton h-9 w-full rounded-lg mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className={cn("space-y-6", className)} {...props}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="glass-card rounded-xl p-4">
              <div className="space-y-3">
                <div className="skeleton w-8 h-8 rounded"></div>
                <div className="skeleton h-6 w-full rounded"></div>
                <div className="skeleton h-4 w-3/4 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="space-y-4">
            <div className="skeleton h-6 w-48 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="skeleton w-10 h-10 rounded"></div>
                    <div className="space-y-1">
                      <div className="skeleton h-4 w-32 rounded"></div>
                      <div className="skeleton h-3 w-24 rounded"></div>
                    </div>
                  </div>
                  <div className="skeleton h-8 w-20 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center py-12", className)} {...props}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-surface rounded-full"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;