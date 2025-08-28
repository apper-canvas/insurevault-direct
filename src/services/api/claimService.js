import claimData from "@/services/mockData/claims.json";

export const claimService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...claimData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const claim = claimData.find(item => item.Id === parseInt(id));
    if (!claim) {
      throw new Error("Claim not found");
    }
    return { ...claim };
  },

  create: async (claimInfo) => {
    await new Promise(resolve => setTimeout(resolve, 450));
    const highestId = Math.max(...claimData.map(item => item.Id));
    const newClaim = {
      Id: highestId + 1,
      ...claimInfo,
      status: "filed",
      filedDate: new Date().toISOString(),
      timeline: [{
        status: "Filed",
        date: new Date().toISOString(),
        description: "Claim filed successfully"
      }]
    };
    claimData.push(newClaim);
    return { ...newClaim };
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = claimData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Claim not found");
    }
    claimData[index] = { ...claimData[index], ...updateData };
    return { ...claimData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = claimData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Claim not found");
    }
    const deletedClaim = { ...claimData[index] };
    claimData.splice(index, 1);
    return deletedClaim;
  },

  getByPolicyId: async (policyId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return claimData.filter(claim => claim.policyId === parseInt(policyId));
  }
};