import { Button } from "@mui/material";
import { Folder, IndianRupee, Layout, Plus, Trash2 } from 'lucide-react';
import React from "react";

interface PlanCardProps {
  planType: "base" | "premium";
  planData: { 
    amount: number; 
    FolderNum: number; 
    WorkspaceNum: number;
  } | null;
  onOpen: (type: "base" | "premium") => void;
  onDelete: (type: "base" | "premium") => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ planType, planData, onOpen, onDelete }) => {
  const isBasePlan = planType === "base";

  return (
    <div className={`${isBasePlan 
      ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
      : 'bg-gradient-to-br from-indigo-900 to-purple-900'} 
      rounded-2xl overflow-hidden shadow-xl`}>
      <div className="p-6 relative">
        <div className="absolute top-6 right-6 flex space-x-2">
          {!planData && (
            <Button
              variant="contained"
              onClick={() => onOpen(planType)}
              className={`${isBasePlan 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-purple-500 hover:bg-purple-600'} 
                min-w-0 px-3 py-1`}
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
          {planData && (
            <Button
              variant="contained"
              onClick={() => onDelete(planType)}
              className="bg-red-500 hover:bg-red-600 min-w-0 px-3 py-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        <h2 className="text-2xl font-bold text-white mb-6">
          {isBasePlan ? 'Base Plan' : 'Premium Plan'}
        </h2>
        
        {planData ? (
          <div className="space-y-4">
            <div className={`flex items-center text-3xl font-bold ${
              isBasePlan ? 'text-blue-400' : 'text-purple-400'
            }`}>
              <IndianRupee className="w-8 h-8 mr-1" />
              {planData.amount}
              <span className="text-lg text-gray-400 ml-2">/month</span>
            </div>
            <div className="space-y-3 mt-6">
              <div className="flex items-center text-gray-300">
                <Folder className={`w-5 h-5 mr-3 ${
                  isBasePlan ? 'text-blue-400' : 'text-purple-400'
                }`} />
                <span>{planData.FolderNum} Folders</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Layout className={`w-5 h-5 mr-3 ${
                  isBasePlan ? 'text-blue-400' : 'text-purple-400'
                }`} />
                <span>{planData.WorkspaceNum} Workspaces</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">
            No {isBasePlan ? 'Base' : 'Premium'} Plan configured
          </p>
        )}
      </div>
    </div>
  );
};

export default PlanCard;