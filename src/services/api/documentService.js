import documentData from "@/services/mockData/documents.json";

export const documentService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...documentData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const document = documentData.find(item => item.Id === parseInt(id));
    if (!document) {
      throw new Error("Document not found");
    }
    return { ...document };
  },

  create: async (documentInfo) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const highestId = Math.max(...documentData.map(item => item.Id));
    const newDocument = {
      Id: highestId + 1,
      ...documentInfo,
      lastModified: new Date().toISOString()
    };
    documentData.push(newDocument);
    return { ...newDocument };
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = documentData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Document not found");
    }
    documentData[index] = { ...documentData[index], ...updateData, lastModified: new Date().toISOString() };
    return { ...documentData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = documentData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Document not found");
    }
    const deletedDocument = { ...documentData[index] };
    documentData.splice(index, 1);
    return deletedDocument;
  },

  getByPolicyId: async (policyId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return documentData.filter(doc => doc.policyId === parseInt(policyId));
  },

  getByClaimId: async (claimId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return documentData.filter(doc => doc.claimId === parseInt(claimId));
  }
};