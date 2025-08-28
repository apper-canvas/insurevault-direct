import { policyService } from "./policyService";

export const recommendationService = {
  getPersonalizedRecommendations: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const [policies, userProfile] = await Promise.all([
        policyService.getAll(),
        policyService.getUserProfile()
      ]);
      
      const activePolicies = policies.filter(p => p.status === "active");
      const recommendations = [];

      // Coverage Gap Analysis
      const hasCoverage = (type) => activePolicies.some(p => p.asset?.type === type);
      
      // Health Insurance Recommendations
      if (!hasCoverage("health")) {
        recommendations.push({
          Id: 1,
          type: "coverage_gap",
          title: "Health Insurance Essential",
          description: "Protect yourself and your family with comprehensive health coverage",
          priority: "high",
          reasoning: "No active health insurance found in your portfolio",
          potentialBenefit: "Cover medical expenses up to ₹10L",
          suggestedCoverage: 1000000,
          estimatedPremium: 25000,
          action: "get_quote",
          category: "health",
          icon: "Heart"
        });
      } else {
        // Critical Illness Add-on for existing health insurance
        const healthPolicies = activePolicies.filter(p => p.asset?.type === "health");
        const hasCriticalIllness = healthPolicies.some(p => 
          p.addOns && p.addOns.includes("critical_illness")
        );
        
        if (!hasCriticalIllness) {
          recommendations.push({
            Id: 2,
            type: "addon_suggestion",
            title: "Critical Illness Cover",
            description: "Add critical illness protection to your existing health insurance",
            priority: "medium",
            reasoning: "Enhance your health coverage with critical illness protection",
            potentialBenefit: "Additional ₹15L coverage for 30+ critical illnesses",
            suggestedCoverage: 1500000,
            estimatedPremium: 8000,
            action: "enhance_policy",
            category: "health_addon",
            icon: "ShieldPlus"
          });
        }
      }

      // Term Life Insurance
      if (!hasCoverage("life")) {
        recommendations.push({
          Id: 3,
          type: "coverage_gap",
          title: "Term Life Insurance",
          description: "Secure your family's financial future with term life insurance",
          priority: "high",
          reasoning: "Essential financial protection for family members",
          potentialBenefit: "₹1Cr life coverage for your family's security",
          suggestedCoverage: 10000000,
          estimatedPremium: 18000,
          action: "get_quote",
          category: "life",
          icon: "Users"
        });
      }

      // Travel Insurance for International Assets
      if (!hasCoverage("travel") && userProfile.preferredBudget > 30000) {
        recommendations.push({
          Id: 4,
          type: "lifestyle_based",
          title: "Annual Travel Insurance",
          description: "Stay protected during domestic and international travels",
          priority: "low",
          reasoning: "Based on your profile, travel coverage would be beneficial",
          potentialBenefit: "Worldwide coverage up to ₹50L for medical emergencies",
          suggestedCoverage: 5000000,
          estimatedPremium: 12000,
          action: "get_quote",
          category: "travel",
          icon: "Plane"
        });
      }

      // Coverage Amount Optimization
      const carPolicies = activePolicies.filter(p => p.asset?.type === "car");
      if (carPolicies.length > 0) {
        const underinsuredCars = carPolicies.filter(p => p.coverageAmount < 500000);
        if (underinsuredCars.length > 0) {
          recommendations.push({
            Id: 5,
            type: "coverage_optimization",
            title: "Increase Car Coverage",
            description: "Your car insurance coverage seems low for current market values",
            priority: "medium",
            reasoning: "Market value appreciation suggests higher coverage needed",
            potentialBenefit: "Better protection against total loss scenarios",
            suggestedCoverage: 800000,
            estimatedPremium: 3000,
            action: "update_coverage",
            category: "motor",
            icon: "Car"
          });
        }
      }

      // Home Insurance for High-Value Assets
      if (!hasCoverage("home") && activePolicies.length >= 2) {
        recommendations.push({
          Id: 6,
          type: "asset_protection",
          title: "Home Insurance Protection",
          description: "Protect your home and belongings from unforeseen damages",
          priority: "medium",
          reasoning: "Multiple policies suggest valuable assets requiring home protection",
          potentialBenefit: "Comprehensive home and contents coverage up to ₹25L",
          suggestedCoverage: 2500000,
          estimatedPremium: 15000,
          action: "get_quote",
          category: "home",
          icon: "Home"
        });
      }

      // Policy Consolidation
      const insurers = [...new Set(activePolicies.map(p => p.insurer))];
      if (insurers.length > 2) {
        recommendations.push({
          Id: 7,
          type: "cost_optimization",
          title: "Consolidate Policies",
          description: "Bundle policies with single insurer for better discounts",
          priority: "low",
          reasoning: `You have policies with ${insurers.length} different insurers`,
          potentialBenefit: "Save up to 15% with multi-policy discounts",
          suggestedCoverage: null,
          estimatedPremium: -12000, // Negative indicates savings
          action: "consolidate",
          category: "optimization",
          icon: "Layers"
        });
      }

      // NCB Protection
      const motorPolicies = activePolicies.filter(p => 
        p.asset?.type === "car" || p.asset?.type === "bike"
      );
      const ncbPolicies = motorPolicies.filter(p => p.ncb > 20);
      const unprotectedNCB = ncbPolicies.filter(p => 
        !p.addOns || !p.addOns.includes("ncb_protection")
      );

      if (unprotectedNCB.length > 0) {
        recommendations.push({
          Id: 8,
          type: "addon_suggestion",
          title: "NCB Protection Cover",
          description: "Protect your hard-earned No Claims Bonus from future claims",
          priority: "medium",
          reasoning: `You have ${unprotectedNCB.length} policies with valuable NCB`,
          potentialBenefit: "Preserve NCB benefits even after making claims",
          suggestedCoverage: null,
          estimatedPremium: 2500,
          action: "add_addon",
          category: "motor_addon",
          icon: "Shield"
        });
      }

      // Sort by priority and return top 5
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return recommendations
        .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
        .slice(0, 5);

    } catch (error) {
      throw new Error("Failed to get personalized recommendations: " + error.message);
    }
  },

  getRecommendationById: async (id) => {
    try {
      const recommendations = await recommendationService.getPersonalizedRecommendations();
      const recommendation = recommendations.find(r => r.Id === parseInt(id));
      if (!recommendation) {
        throw new Error("Recommendation not found");
      }
      return recommendation;
    } catch (error) {
      throw new Error("Failed to get recommendation: " + error.message);
    }
  },

  dismissRecommendation: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    // In real implementation, this would update user preferences
    return { success: true, message: "Recommendation dismissed" };
  },

  requestQuote: async (recommendationId, userDetails = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const recommendation = await recommendationService.getRecommendationById(recommendationId);
      
      // Generate mock quote based on recommendation
      const quote = {
        Id: Date.now(),
        recommendationId,
        type: recommendation.category,
        insurer: "Recommended Insurer",
        premium: recommendation.estimatedPremium,
        coverage: recommendation.suggestedCoverage,
        features: [
          "Cashless network of 5000+ hospitals",
          "24/7 customer support",
          "Quick claim settlement",
          "No medical checkup required"
        ],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active"
      };
      
      return quote;
    } catch (error) {
      throw new Error("Failed to request quote: " + error.message);
    }
  }
};