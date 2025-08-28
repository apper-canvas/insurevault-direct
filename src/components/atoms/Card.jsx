import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  variant = "default",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "glass-card shadow-card",
    elevated: "bg-white shadow-elevated border border-gray-100",
    glass: "glass-card-dark",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-card border border-gray-100",
  };
  
  return (
    <div
      className={cn(
        "rounded-xl p-6 transition-all duration-200",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;