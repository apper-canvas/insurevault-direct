import { policyService } from "./policyService";

export const savingsCalculatorService = {
  calculateSavings: async () => {
    try {
      // Get all active policies
      const policies = await policyService.getAll();
      const activePolicies = policies.filter(p => p.status === "active");
      
      if (activePolicies.length === 0) {
        return {
          totalSavings: 0,
          savingsPercentage: 0,
          policyCount: 0,
          breakdown: [],
          tip: "Add policies to start saving with multi-policy discounts!"
        };
      }

      // Calculate base premium total
      const totalPremium = activePolicies.reduce((sum, policy) => sum + policy.premium, 0);
      
      // Calculate various savings
      const breakdown = [];
      let totalSavings = 0;

      // Multi-policy discount (8-12% for 3+ policies, 5-8% for 2 policies)
      if (activePolicies.length >= 3) {
        const discount = Math.min(0.12, 0.08 + (activePolicies.length - 3) * 0.01);
        const amount = Math.round(totalPremium * discount);
        totalSavings += amount;
        breakdown.push({
          type: "multi-policy",
          name: "Multi-Policy Discount",
          description: `${activePolicies.length} policies with same group`,
          amount,
          percentage: (discount * 100).toFixed(1)
        });
      } else if (activePolicies.length === 2) {
        const discount = 0.05 + Math.random() * 0.03; // 5-8%
        const amount = Math.round(totalPremium * discount);
        totalSavings += amount;
        breakdown.push({
          type: "multi-policy", 
          name: "Multi-Policy Discount",
          description: "2 policies bundle discount",
          amount,
          percentage: (discount * 100).toFixed(1)
        });
      }

      // Loyalty discount for policies over 1 year old
      const loyaltyPolicies = activePolicies.filter(p => {
        const policyAge = (Date.now() - new Date(p.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
        return policyAge >= 1;
      });
      
      if (loyaltyPolicies.length > 0) {
        const loyaltyPremium = loyaltyPolicies.reduce((sum, p) => sum + p.premium, 0);
        const discount = 0.02 + (loyaltyPolicies.length * 0.01); // 2-5%
        const amount = Math.round(loyaltyPremium * discount);
        totalSavings += amount;
        breakdown.push({
          type: "loyalty",
          name: "Loyalty Rewards",
          description: `${loyaltyPolicies.length} long-term policies`,
          amount,
          percentage: (discount * 100).toFixed(1)
        });
      }

      // Same insurer bundle discount
      const insurerGroups = activePolicies.reduce((groups, policy) => {
        const insurer = policy.insurer;
        if (!groups[insurer]) groups[insurer] = [];
        groups[insurer].push(policy);
        return groups;
      }, {});

      Object.entries(insurerGroups).forEach(([insurer, insurerPolicies]) => {
        if (insurerPolicies.length >= 2) {
          const bundlePremium = insurerPolicies.reduce((sum, p) => sum + p.premium, 0);
          const discount = 0.05 + (insurerPolicies.length - 2) * 0.015; // 5-10%
          const amount = Math.round(bundlePremium * discount);
          totalSavings += amount;
          breakdown.push({
            type: "bundle",
            name: `${insurer} Bundle`,
            description: `${insurerPolicies.length} policies with same insurer`,
            amount,
            percentage: (discount * 100).toFixed(1)
          });
        }
      });

      // NCB preservation savings
      const ncbPolicies = activePolicies.filter(p => p.ncb && p.ncb > 0);
      if (ncbPolicies.length > 0) {
        const ncbSavings = ncbPolicies.reduce((sum, p) => {
          return sum + Math.round(p.premium * (p.ncb / 100));
        }, 0);
        
        totalSavings += ncbSavings;
        breakdown.push({
          type: "ncb",
          name: "No Claims Bonus",
          description: "NCB preserved across policies",
          amount: ncbSavings,
          percentage: "Varies"
        });
      }

      // Generate optimization tip
      const tips = [
        "Consider consolidating with a single insurer for additional bundle discounts.",
        "Maintain claim-free records to increase your NCB savings year over year.", 
        "Add a health or term policy to unlock higher multi-policy discount tiers.",
        "Review renewal dates to align policies for maximum discount benefits."
      ];
      
      const tip = activePolicies.length < 3 
        ? "Add one more policy to unlock higher multi-policy discounts!"
        : tips[Math.floor(Math.random() * tips.length)];

      return {
        totalSavings,
        savingsPercentage: (totalSavings / totalPremium) * 100,
        policyCount: activePolicies.length,
        breakdown: breakdown.sort((a, b) => b.amount - a.amount), // Sort by savings amount
        tip
      };

    } catch (error) {
      throw new Error("Failed to calculate savings: " + error.message);
    }
  },

  // Get potential savings scenarios for adding new policies
  getOptimizationSuggestions: async () => {
    try {
      const policies = await policyService.getAll();
      const activePolicies = policies.filter(p => p.status === "active");
      
      const suggestions = [];
      
      if (activePolicies.length < 3) {
        suggestions.push({
          type: "multi-policy",
          title: "Unlock Multi-Policy Discounts",
          description: `Add ${3 - activePolicies.length} more policies to save up to 12%`,
          potentialSavings: 15000
        });
      }
      
      // Check for insurer consolidation opportunities
      const insurers = [...new Set(activePolicies.map(p => p.insurer))];
      if (insurers.length > 2) {
        suggestions.push({
          type: "consolidation", 
          title: "Consolidate Insurers",
          description: "Move policies to one insurer for bundle discounts",
          potentialSavings: 8000
        });
      }
      
      return suggestions;
      
    } catch (error) {
      throw new Error("Failed to get optimization suggestions: " + error.message);
    }
  }
};