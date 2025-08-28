import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import RecommendationCard from "@/components/molecules/RecommendationCard";

const Recommendations = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-primary-50/30 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-gray-600"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Personalized Recommendations</h1>
              <p className="text-gray-600">Optimize your insurance portfolio with AI-powered insights</p>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Target" className="w-4 h-4 text-primary-600" />
              </div>
              <h3 className="font-medium text-gray-900">Coverage Analysis</h3>
            </div>
            <p className="text-sm text-gray-600">AI analyzes your existing policies to identify coverage gaps</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-4 h-4 text-accent-600" />
              </div>
              <h3 className="font-medium text-gray-900">Cost Optimization</h3>
            </div>
            <p className="text-sm text-gray-600">Find opportunities to save money while improving coverage</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="UserCheck" className="w-4 h-4 text-secondary-600" />
              </div>
              <h3 className="font-medium text-gray-900">Personal Matching</h3>
            </div>
            <p className="text-sm text-gray-600">Recommendations tailored to your lifestyle and needs</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How Our Recommendations Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Search" className="w-6 h-6 text-primary-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Analyze Portfolio</h4>
              <p className="text-xs text-gray-600">We review your current policies and coverage</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Brain" className="w-6 h-6 text-accent-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">AI Assessment</h4>
              <p className="text-xs text-gray-600">Advanced algorithms identify gaps and opportunities</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Lightbulb" className="w-6 h-6 text-secondary-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Generate Insights</h4>
              <p className="text-xs text-gray-600">Personalized recommendations based on your profile</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-warning" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Take Action</h4>
              <p className="text-xs text-gray-600">One-click access to quotes and policy enhancements</p>
            </div>
          </div>
        </div>

        {/* All Recommendations */}
        <RecommendationCard showAll={true} />
      </div>
    </div>
  );
};

export default Recommendations;