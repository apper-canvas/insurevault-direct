import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  children = "", 
  ...props 
}, ref) => {
  // Prevent object rendering by ensuring children is always a valid React node
  const safeChildren = typeof children === 'object' && children !== null && !React.isValidElement(children)
    ? String(children.text || children.label || children.value || children)
    : children;
const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    active: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800",
    expired: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
    pending: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800",
  };
  
return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant] || variants.default,
        className
      )}
      ref={ref}
      {...props}
    >
      {safeChildren}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;