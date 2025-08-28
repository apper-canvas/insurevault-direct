import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ChecklistCard from "@/components/molecules/ChecklistCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { riskReductionService } from "@/services/api/riskReductionService";

const SafetyChecklists = ({ searchTerm = "", filterType = "all", className }) => {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadChecklists = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await riskReductionService.getAll();
      setChecklists(data);
    } catch (err) {
      setError("Failed to load safety checklists. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChecklists();
  }, []);

  const handleTaskToggle = async (checklistId, taskId, completed) => {
    try {
      await riskReductionService.updateTaskStatus(checklistId, taskId, completed);
      toast.success(completed ? "Safety task completed!" : "Task marked as pending");
      loadChecklists(); // Refresh to show updated progress
    } catch (error) {
      toast.error(`Failed to update task: ${error.message}`);
    }
  };

  const handleCompleteChecklist = async (checklistId) => {
    try {
      await riskReductionService.markCompleted(checklistId);
      toast.success("Checklist completed! Your safety score has improved.");
      loadChecklists();
    } catch (error) {
      toast.error(`Failed to complete checklist: ${error.message}`);
    }
  };

  const filteredChecklists = checklists.filter(checklist => {
    const matchesSearch = !searchTerm || 
      checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.tasks.some(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === "all" || checklist.assetType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <Loading variant="cards" className={className} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadChecklists} className={className} />;
  }

  if (filteredChecklists.length === 0) {
    return (
      <Empty
        title="No Safety Checklists Found"
        description={searchTerm || filterType !== "all" ? 
          "No checklists match your search criteria. Try adjusting your filters." :
          "No safety checklists available. Add some policies to get personalized safety recommendations."
        }
        icon="Shield"
        className={className}
      />
    );
  }

  return (
    <div className={className}>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredChecklists.map((checklist) => (
          <ChecklistCard
            key={checklist.Id}
            checklist={checklist}
            onTaskToggle={handleTaskToggle}
            onComplete={handleCompleteChecklist}
          />
        ))}
      </div>
    </div>
  );
};

export default SafetyChecklists;