import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const ChecklistCard = ({ 
  checklist,
  className,
  onTaskToggle,
  onComplete,
  ...props 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const getAssetIcon = (assetType) => {
    const icons = {
      car: "Car",
      bike: "Bike", 
      home: "Home",
      gadget: "Smartphone",
      health: "Heart",
      travel: "Plane"
    };
    return icons[assetType] || "Shield";
  };

  const getAssetColor = (assetType) => {
    const colors = {
      car: "bg-blue-100 text-blue-700 border-blue-200",
      bike: "bg-green-100 text-green-700 border-green-200",
      home: "bg-purple-100 text-purple-700 border-purple-200",
      gadget: "bg-orange-100 text-orange-700 border-orange-200",
      health: "bg-red-100 text-red-700 border-red-200",
      travel: "bg-indigo-100 text-indigo-700 border-indigo-200"
    };
    return colors[assetType] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const completedTasks = checklist.tasks.filter(task => task.completed).length;
  const totalTasks = checklist.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isCompleted = progressPercentage === 100;

  const priorityColors = {
    high: "text-red-600",
    medium: "text-yellow-600", 
    low: "text-green-600"
  };

  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 hover:shadow-elevated transition-all duration-300",
        isCompleted && "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center border",
            getAssetColor(checklist.assetType)
          )}>
            <ApperIcon name={getAssetIcon(checklist.assetType)} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{checklist.title}</h3>
            <p className="text-xs text-gray-600 capitalize">{checklist.assetType} Safety</p>
          </div>
        </div>
        
        {isCompleted && (
          <Badge variant="success" className="text-xs">
            <ApperIcon name="CheckCircle" className="w-3 h-3 mr-1" />
            Complete
          </Badge>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">{checklist.description}</p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress: {completedTasks}/{totalTasks}
          </span>
          <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              isCompleted 
                ? "bg-gradient-to-r from-green-500 to-green-600" 
                : "bg-gradient-to-r from-primary-500 to-primary-600"
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Task Preview or Full List */}
      <div className="space-y-2 mb-4">
        {(expanded ? checklist.tasks : checklist.tasks.slice(0, 3)).map((task, index) => (
          <div key={task.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <button
              onClick={() => onTaskToggle?.(checklist.Id, task.id, !task.completed)}
              className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
                task.completed 
                  ? "bg-green-500 border-green-500 text-white" 
                  : "border-gray-300 hover:border-primary-500"
              )}
            >
              {task.completed && <ApperIcon name="Check" className="w-3 h-3" />}
            </button>
            <div className="flex-1">
              <p className={cn(
                "text-sm",
                task.completed ? "line-through text-gray-500" : "text-gray-700"
              )}>
                {task.title}
              </p>
              {task.priority && (
                <span className={cn("text-xs font-medium", priorityColors[task.priority])}>
                  {task.priority.toUpperCase()} Priority
                </span>
              )}
            </div>
          </div>
        ))}
        
        {checklist.tasks.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            <ApperIcon 
              name={expanded ? "ChevronUp" : "ChevronDown"} 
              className="w-4 h-4" 
            />
            {expanded ? "Show Less" : `Show ${checklist.tasks.length - 3} More`}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {!isCompleted ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setExpanded(!expanded)}
            >
              <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
              {expanded ? "Collapse" : "View All"}
            </Button>
            {progressPercentage > 80 && (
              <Button
                variant="primary"
                size="sm" 
                className="flex-1"
                onClick={() => onComplete?.(checklist.Id)}
              >
                <ApperIcon name="CheckCircle" className="w-4 h-4 mr-2" />
                Complete
              </Button>
            )}
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => setExpanded(!expanded)}
          >
            <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
            Review Tasks
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChecklistCard;