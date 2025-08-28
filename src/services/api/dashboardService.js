import { policyService } from "./policyService";
import { claimService } from "./claimService";

export const dashboardService = {
  getDashboardData: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const policies = await policyService.getAll();
    const claims = await claimService.getAll();
    
    const activePolicies = policies.filter(p => p.status === "active").length;
    const totalCoverage = policies.reduce((sum, p) => sum + (p.coverageAmount || 0), 0);
    const activeClaims = claims.filter(c => ["filed", "processing"].includes(c.status)).length;
    const annualSavings = 15000; // Mock value for multi-policy discount
    
    return {
      stats: {
        activePolicies,
        totalCoverage,
        activeClaims,
        annualSavings
      },
      recentPolicies: policies.slice(0, 3),
      recentClaims: claims.slice(0, 2),
      upcomingRenewals: policies.filter(p => {
        const endDate = new Date(p.endDate);
        const today = new Date();
        const diffInDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        return diffInDays <= 90 && diffInDays > 0;
      })
    };
  }
};