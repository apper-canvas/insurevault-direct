import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const QuoteComparison = ({ 
  quotes = [],
  onSelectQuote,
  onCompareQuotes,
  showComparisonButton = false,
  className,
  ...props 
}) => {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
    onSelectQuote?.(quote);
  };

  const toggleExpanded = (quoteId) => {
    setExpandedCard(expandedCard === quoteId ? null : quoteId);
  };

return (
    <div className={cn("space-y-6", className)} {...props}>
      <div className="flex items-center justify-between mb-6">
        <div className="text-center flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Compare Insurance Plans
          </h3>
          <p className="text-gray-600">
            Choose the best coverage for your needs
          </p>
        </div>
        {showComparisonButton && quotes.length > 1 && (
          <Button 
            variant="outline" 
            onClick={() => onCompareQuotes?.(quotes)}
          >
            <ApperIcon name="BarChart3" className="w-4 h-4 mr-2" />
            Advanced Compare
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {quotes.map((quote) => {
          const isSelected = selectedQuote?.id === quote.id;
          const isExpanded = expandedCard === quote.id;
          
          return (
            <div
              key={quote.id}
              className={cn(
                "glass-card rounded-xl p-6 transition-all duration-300 cursor-pointer",
                isSelected 
                  ? "ring-2 ring-primary-500 shadow-elevated bg-gradient-to-br from-primary-50 to-blue-50" 
                  : "hover:shadow-card"
              )}
              onClick={() => handleSelectQuote(quote)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <span className="font-bold text-sm text-gray-700">
                      {quote.insurer.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{quote.insurer}</h4>
                    <p className="text-sm text-gray-500">{quote.planName || "Standard Plan"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold gradient-text">
                    ₹{quote.premium.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">per year</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <p className="text-sm text-gray-600">Coverage Amount</p>
                  <p className="font-semibold text-gray-900">
                    ₹{quote.coverage?.amount?.toLocaleString() || "5,00,000"}
                  </p>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <p className="text-sm text-gray-600">Deductible</p>
                  <p className="font-semibold text-gray-900">
                    ₹{quote.coverage?.deductible?.toLocaleString() || "5,000"}
                  </p>
                </div>
              </div>
<div className="flex flex-wrap gap-1 mt-3">
                {/* Features badges */}
                {(quote.features || ["Cashless Claims", "24/7 Support", "Quick Settlement"]).slice(0, 3).map((feature, index, arr, quoteIndex = quotes.findIndex(q => q.id === quote.id)) => (
                  <Badge key={`${quoteIndex}-feature-${index}`} variant="primary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {(quote.features || []).length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{(quote.features || []).length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded(quote.id);
                  }}
                  className="text-primary-600"
                >
                  <ApperIcon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                    className="w-4 h-4 mr-1" 
                  />
                  {isExpanded ? "Less Details" : "More Details"}
                </Button>
                
                {isSelected && (
                  <Badge variant="success">
                    <ApperIcon name="Check" className="w-3 h-3 mr-1" />
                    Selected
                  </Badge>
                )}
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-slide-up">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Key Features</h5>
                    <div className="space-y-3">
                      {(quote.features || [
                        "Cashless Claims at 5000+ Hospitals",
                        "24/7 Customer Support",
                        "Quick Claim Settlement",
                        "Pre-policy Medical Checkup",
                        "Online Policy Management"
                      ]).map((feature, index) => (
                        <div key={`${quote.id}-feature-${index}`} className="flex items-center gap-2">
                          <ApperIcon name="Check" className="w-4 h-4 text-accent-600" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Coverage Details</h5>
                    <div className="space-y-3">
                      {(quote.coverage?.details || [
                        "Comprehensive Coverage", "Third Party Liability", "Personal Accident Cover"
                      ]).map((detail, index) => (
                        <div key={`${quote.id}-coverage-${index}`} className="flex items-center gap-2">
                          <ApperIcon name="Check" className="w-4 h-4 text-accent-600" />
                          <span className="text-sm text-gray-600">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
<div>
                    <h5 className="font-medium text-gray-900 mb-2">Exclusions</h5>
                    <div className="space-y-3">
                      {(quote.exclusions || [
                        "Pre-existing conditions (first 2 years)",
                        "War & Nuclear Risks", 
                        "Wear & Tear", 
                        "Consequential Loss"
                      ]).map((exclusion, index) => (
                        <div key={`${quote.id}-exclusion-${index}`} className="flex items-center gap-2">
                          <ApperIcon name="X" className="w-4 h-4 text-error" />
                          <span className="text-sm text-gray-600">{exclusion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              )}
            </div>
          );
        })}
      </div>

      {selectedQuote && (
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 -mx-6 -mb-6 rounded-b-xl">
          <Button 
            variant="primary" 
            size="lg"
            className="w-full"
            onClick={() => onSelectQuote?.(selectedQuote)}
          >
            Continue with {selectedQuote.insurer} - ₹{selectedQuote.premium.toLocaleString()}
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuoteComparison;