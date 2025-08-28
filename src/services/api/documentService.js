import documentData from "@/services/mockData/documents.json";
import { toast } from "react-toastify";

export const documentService = {
  getAll: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 250));
      return [...documentData];
    } catch (error) {
      toast.error(`Failed to load documents: ${error.message}`);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const document = documentData.find(item => item.Id === parseInt(id));
      if (!document) {
        throw new Error("Document not found");
      }
      return { ...document };
    } catch (error) {
      toast.error(`Failed to load document: ${error.message}`);
      throw error;
    }
  },

  create: async (documentInfo) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const highestId = Math.max(...documentData.map(item => item.Id), 0);
      const newDocument = {
        Id: highestId + 1,
        ...documentInfo,
        lastModified: new Date().toISOString(),
        fileSize: documentInfo.fileSize || "0 MB",
        url: documentInfo.url || `/documents/${documentInfo.name.toLowerCase().replace(/\s+/g, '-')}`
      };
      documentData.push(newDocument);
      toast.success("Document uploaded successfully");
      return { ...newDocument };
    } catch (error) {
      toast.error(`Failed to upload document: ${error.message}`);
      throw error;
    }
  },

  update: async (id, updateData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 350));
      const index = documentData.findIndex(item => item.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Document not found");
      }
      documentData[index] = { 
        ...documentData[index], 
        ...updateData, 
        lastModified: new Date().toISOString() 
      };
      toast.success("Document updated successfully");
      return { ...documentData[index] };
    } catch (error) {
      toast.error(`Failed to update document: ${error.message}`);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = documentData.findIndex(item => item.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Document not found");
      }
      const deletedDocument = { ...documentData[index] };
      documentData.splice(index, 1);
      toast.success("Document deleted successfully");
      return deletedDocument;
    } catch (error) {
      toast.error(`Failed to delete document: ${error.message}`);
      throw error;
    }
  },

  getByPolicyId: async (policyId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return documentData.filter(doc => doc.policyId === parseInt(policyId));
    } catch (error) {
      toast.error(`Failed to load policy documents: ${error.message}`);
      throw error;
    }
  },

  getByClaimId: async (claimId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return documentData.filter(doc => doc.claimId === parseInt(claimId));
    } catch (error) {
      toast.error(`Failed to load claim documents: ${error.message}`);
      throw error;
    }
  },

  getByType: async (type) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return documentData.filter(doc => doc.type === type);
    } catch (error) {
      toast.error(`Failed to load ${type} documents: ${error.message}`);
      throw error;
    }
  },

  searchDocuments: async (searchTerm) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      if (!searchTerm) return [...documentData];
      
      const lowercaseSearch = searchTerm.toLowerCase();
      return documentData.filter(doc => 
        doc.name.toLowerCase().includes(lowercaseSearch) ||
        doc.description.toLowerCase().includes(lowercaseSearch) ||
        doc.type.toLowerCase().includes(lowercaseSearch)
      );
    } catch (error) {
      toast.error(`Failed to search documents: ${error.message}`);
      throw error;
    }
  }
};