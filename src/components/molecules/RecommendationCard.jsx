import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { recommendationService } from "@/services/api/recommendationService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const RecommendationCard = ({ className, showAll = false, ...props }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await recommendationService.getPersonalizedRecommendations();
      setRecommendations(showAll ? data : data.slice(0, 2));
    } catch (err) {
      setError("Failed to load recommendations");
      toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [showAll]);

  const handleAction = async (recommendation) => {
    try {
      if (recommendation.action === "get_quote") {
        const quote = await recommendationService.requestQuote(recommendation.Id);
        toast.success("Quote requested successfully!");
        navigate("/policies/compare");
      } else if (recommendation.action === "enhance_policy") {
        toast.success("Policy enhancement initiated!");
        navigate("/policies");
      } else if (recommendation.action === "update_coverage") {
        toast.success("Coverage update requested!");
        navigate("/policies");
      } else if (recommendation.action === "consolidate") {
        toast.info("Consolidation analysis started!");
        navigate("/policies/compare");
      } else {
        toast.success("Action initiated successfully!");
        navigate("/policies");
      }
    } catch (error) {
      toast.error("Failed to process request");
    }
  };

  const handleDismiss = async (recommendationId) => {
    try {
      await recommendationService.dismissRecommendation(recommendationId);
      setRecommendations(prev => prev.filter(r => r.Id !== recommendationId));
      toast.success("Recommendation dismissed");
    } catch (error) {
      toast.error("Failed to dismiss recommendation");
    }
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: "error",
      medium: "warning", 
      low: "info"
    };
    return variants[priority] || "default";
  };

  if (loading) return <Loading className="h-48" />;
  if (error) return <Error message={error} onRetry={loadRecommendations} />;
  if (recommendations.length === 0) return null;

  return (
    <Card className={cn("p-6", className)} {...props}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
            <ApperIcon name="Lightbulb" className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Personalized Recommendations</h3>
            <p className="text-sm text-gray-500">Based on your profile and policy analysis</p>
          </div>
        </div>
        {!showAll && recommendations.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/recommendations")}
          >
            View All
            <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.Id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ApperIcon name={recommendation.icon} className="w-4 h-4 text-accent-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
                    <Badge variant={getPriorityBadge(recommendation.priority)} className="text-xs">
                      {recommendation.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>
                  <p className="text-xs text-gray-500">{recommendation.reasoning}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss(recommendation.Id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Potential Benefit:</span>
                <span className="font-medium text-accent-600">{recommendation.potentialBenefit}</span>
              </div>
              {recommendation.estimatedPremium && (
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">
                    {recommendation.estimatedPremium > 0 ? "Estimated Premium:" : "Potential Savings:"}
                  </span>
                  <span className={cn(
                    "font-medium",
                    recommendation.estimatedPremium > 0 ? "text-gray-900" : "text-success"
                  )}>
                    ₹{Math.abs(recommendation.estimatedPremium).toLocaleString()}
                    {recommendation.estimatedPremium < 0 && " saved"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => handleAction(recommendation)}
              >
                {recommendation.action === "get_quote" && "Get Quote"}
                {recommendation.action === "enhance_policy" && "Enhance Policy"}
                {recommendation.action === "update_coverage" && "Update Coverage"}
                {recommendation.action === "consolidate" && "View Options"}
                {recommendation.action === "add_addon" && "Add Feature"}
                {!["get_quote", "enhance_policy", "update_coverage", "consolidate", "add_addon"].includes(recommendation.action) && "Learn More"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecommendationCard;