import assetData from "@/services/mockData/assets.json";

export const assetService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...assetData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const asset = assetData.find(item => item.Id === parseInt(id));
    if (!asset) {
      throw new Error("Asset not found");
    }
    return { ...asset };
  },

  create: async (assetInfo) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const highestId = Math.max(...assetData.map(item => item.Id));
    const newAsset = {
      Id: highestId + 1,
      ...assetInfo,
      createdAt: new Date().toISOString()
    };
    assetData.push(newAsset);
    return { ...newAsset };
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = assetData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Asset not found");
    }
    assetData[index] = { ...assetData[index], ...updateData };
    return { ...assetData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = assetData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Asset not found");
    }
    const deletedAsset = { ...assetData[index] };
    assetData.splice(index, 1);
    return deletedAsset;
  }
};