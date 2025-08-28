import policyData from "@/services/mockData/policies.json";

export const policyService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [...policyData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const policy = policyData.find(item => item.Id === parseInt(id));
    if (!policy) {
      throw new Error("Policy not found");
    }
    return { ...policy };
  },

  create: async (policyInfo) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const highestId = Math.max(...policyData.map(item => item.Id));
    const newPolicy = {
      Id: highestId + 1,
      ...policyInfo,
      policyNumber: `POL${Date.now()}`,
      documents: [],
      status: "active"
    };
    policyData.push(newPolicy);
    return { ...newPolicy };
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = policyData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Policy not found");
    }
    policyData[index] = { ...policyData[index], ...updateData };
    return { ...policyData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = policyData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Policy not found");
    }
    const deletedPolicy = { ...policyData[index] };
    policyData.splice(index, 1);
    return deletedPolicy;
  },

  getByAssetId: async (assetId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return policyData.filter(policy => policy.assetId === parseInt(assetId));
  }
};