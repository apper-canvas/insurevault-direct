import paymentData from "@/services/mockData/payments.json";

export const paymentService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...paymentData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const payment = paymentData.find(item => item.Id === parseInt(id));
    if (!payment) {
      throw new Error("Payment not found");
    }
    return { ...payment };
  },

  getByPolicyId: async (policyId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return paymentData.filter(payment => payment.policyId === parseInt(policyId));
  },

  create: async (paymentInfo) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const highestId = Math.max(...paymentData.map(item => item.Id));
    const newPayment = {
      Id: highestId + 1,
      ...paymentInfo,
      createdAt: new Date().toISOString(),
      status: "pending"
    };
    paymentData.push(newPayment);
    return { ...newPayment };
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = paymentData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Payment not found");
    }
    paymentData[index] = { 
      ...paymentData[index], 
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return { ...paymentData[index] };
  },

  processPayment: async (id, paymentMethod) => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
    const index = paymentData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Payment not found");
    }
    
    const transactionId = `TXN${Date.now()}`;
    const updatedPayment = {
      ...paymentData[index],
      status: "paid",
      paidDate: new Date().toISOString(),
      paymentMethod,
      transactionId,
      updatedAt: new Date().toISOString()
    };
    
    paymentData[index] = updatedPayment;
    return { ...updatedPayment };
  },

  getUpcoming: async (days = 30) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return paymentData.filter(payment => {
      const dueDate = new Date(payment.dueDate);
      return dueDate <= futureDate && (payment.status === "pending" || payment.status === "upcoming");
    });
  },

  getOverdue: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const today = new Date();
    
    return paymentData.filter(payment => {
      const dueDate = new Date(payment.dueDate);
      return dueDate < today && payment.status === "pending";
    });
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = paymentData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Payment not found");
    }
    const deletedPayment = { ...paymentData[index] };
    paymentData.splice(index, 1);
    return deletedPayment;
  }
};