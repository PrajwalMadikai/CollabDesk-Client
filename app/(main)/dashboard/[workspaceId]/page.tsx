'use client';
import { useWorkspace } from '@/hooks/useWorkspaceHook';
import { Box, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function WorkspaceDashboard() {
  const { workspaceId }:{workspaceId:string} = useParams() 
  const [showUserLogs, setShowUserLogs] = useState(false);

  const workspace = useWorkspace() 
  if (!workspace) {
    console.error('useWorkspace context is not available');
    return null;
  }
  const { userAction, userLogs } = workspace;

  const toggleUserLogs = () => {
    setShowUserLogs(!showUserLogs);
  };

  useEffect(() => {
    if(workspaceId){
      userAction(workspaceId);
    }
  }, [workspaceId]);
  

  return (
    <div className="flex flex-col w-full h-screen">
      {/* Header Section */}
      <div className="w-full flex justify-between items-center p-4 border-b">
        <button
          onClick={toggleUserLogs}
          className="ml-auto flex items-center gap-2 px-4 mr-11 py-2 border  rounded-[3px] bg-transparent transition-colors"
        >
          <Box size={18} />
          <span>Workspace Logs</span>
        </button>
      </div>

      <div className="flex flex-grow relative">
        <div className="flex items-center justify-center w-full h-full">
          <img
            src="/collabdesk white logo.png"
            alt="Workspace Dashboard"
            className="max-w-full h-auto w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%]"
          />
        </div>

        {showUserLogs && (
          <div className="absolute rounded-[4px] top-0 right-10 h-[600px] w-[400px] bg-gray-950 border-l shadow-lg flex flex-col ">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium text-white">User Logs</h3>
              <button
                onClick={toggleUserLogs}
                className="p-1 rounded-full hover:bg-gray-700"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-grow">
              <p className="text-sm text-gray-400 mb-4">Recent user activity:</p>
              <ul className="space-y-2 max-h-[580px] overflow-y-auto custom-scrollbar">
                {userLogs.map((log, index) => (
                  <li key={index} className="p-2  rounded text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="block font-normal  text-gray-400 text-[12px]">{log.email}</span>
                        <span className="block text-sm">{log.action}</span>
                      </div>
                      <span className="text-xs text-gray-500 self-start">
                        {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

 