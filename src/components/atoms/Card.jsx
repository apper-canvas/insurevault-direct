import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = React.memo(forwardRef(({ 
  className, 
  variant = "default",
  children, 
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-lg shadow-sm border border-gray-200";
  
  const variants = {
    default: "bg-white",
    elevated: "shadow-lg",
    glass: "glass-card"
  };
  
  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}));

Card.displayName = "Card";

export default Card;