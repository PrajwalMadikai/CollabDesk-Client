'use client';
import { Box, X } from 'lucide-react';
import { useState } from 'react';

export default function WorkspaceDashboard() {
  const [showUserLogs, setShowUserLogs] = useState(false);

  const toggleUserLogs = () => {
    setShowUserLogs(!showUserLogs);
  };

  return (
    <div className="flex flex-col w-full h-screen">
      {/* Header Section */}
      <div className="w-full flex justify-between items-center p-4 border-b">
        <button 
          onClick={toggleUserLogs}
          className="ml-auto flex items-center gap-2 px-4 mr-11 py-2 border rounded-md bg-transparent   transition-colors"
        >
          <Box size={18} />
          <span>User Logs</span>
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
          <div className="absolute rounded-[4px] top-0 right-10 min-h-[600px] max-h-[700px] w-[400px] bg-gray-950 border-l shadow-lg flex flex-col overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium">User Logs</h3>
              <button 
                onClick={toggleUserLogs}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-grow">
              <p className="text-sm text-gray-600 mb-4">Recent user activity:</p>
              <ul className="space-y-2">
                <li className="p-2 bg-gray-50 rounded">User login: john@example.com (2 mins ago)</li>
                <li className="p-2 bg-gray-50 rounded">File uploaded: report.pdf (15 mins ago)</li>
                <li className="p-2 bg-gray-50 rounded">Settings changed (1 hour ago)</li>
                <li className="p-2 bg-gray-50 rounded">New user invited: sarah@example.com (3 hours ago)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}