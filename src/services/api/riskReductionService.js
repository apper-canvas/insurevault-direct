import riskReductionData from "@/services/mockData/riskReduction.json";

export const riskReductionService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [...riskReductionData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const checklist = riskReductionData.find(item => item.Id === parseInt(id));
    if (!checklist) {
      throw new Error("Safety checklist not found");
    }
    return { ...checklist };
  },

  getByAssetType: async (assetType) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return riskReductionData.filter(checklist => checklist.assetType === assetType);
  },

  updateTaskStatus: async (checklistId, taskId, completed) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const checklistIndex = riskReductionData.findIndex(item => item.Id === parseInt(checklistId));
    if (checklistIndex === -1) {
      throw new Error("Checklist not found");
    }
    
    const taskIndex = riskReductionData[checklistIndex].tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    
    riskReductionData[checklistIndex].tasks[taskIndex].completed = completed;
    riskReductionData[checklistIndex].tasks[taskIndex].completedAt = completed ? new Date().toISOString() : null;
    
    return { ...riskReductionData[checklistIndex] };
  },

  markCompleted: async (checklistId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const checklistIndex = riskReductionData.findIndex(item => item.Id === parseInt(checklistId));
    if (checklistIndex === -1) {
      throw new Error("Checklist not found");
    }
    
    // Mark all tasks as completed
    riskReductionData[checklistIndex].tasks.forEach(task => {
      task.completed = true;
      task.completedAt = new Date().toISOString();
    });
    
    riskReductionData[checklistIndex].completedAt = new Date().toISOString();
    riskReductionData[checklistIndex].status = "completed";
    
    return { ...riskReductionData[checklistIndex] };
  },

  getPersonalizedTips: async (policyIds) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock personalized tips based on policy types
    const tips = riskReductionData.flatMap(checklist => 
      checklist.tasks.map(task => ({
        id: task.id,
        checklistId: checklist.Id,
        assetType: checklist.assetType,
        tip: task.title,
        description: task.description || `Complete this task to reduce ${checklist.assetType} risks`,
        priority: task.priority,
        completed: task.completed
      }))
    );
    
    return tips.filter(tip => !tip.completed).slice(0, 10); // Return top 10 uncompleted tips
  }
};