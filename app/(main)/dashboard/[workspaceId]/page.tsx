'use client';
import { Box, X } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useWorkspace } from '../../../../hooks/useWorkspaceHook';

export default function WorkspaceDashboard() {
  const { workspaceId } = useParams();
  const [showUserLogs, setShowUserLogs] = useState(false);

  // Detect screen sizes
  const isMediumScreen = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });

  const workspace = useWorkspace();

  useEffect(() => {
    if (workspaceId && workspace?.userAction) {
      const finalWorkspaceId = Array.isArray(workspaceId) ? workspaceId[0] : workspaceId;
      workspace.userAction(finalWorkspaceId);
    }
  }, [workspaceId]);

  if (!workspace) {
    return null;
  }

  const { userLogs } = workspace;

  const toggleUserLogs = () => {
    setShowUserLogs(!showUserLogs);
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="w-full flex justify-between items-center p-4 border-b">
        <button
          onClick={toggleUserLogs}
          className="ml-auto flex items-center gap-2 px-4 mr-11 py-2 border rounded-[3px] bg-transparent transition-colors"
        >
          <Box size={18} />
          <span> Logs</span>
        </button>
      </div>

      <div className="flex flex-grow relative">
        <div className="flex items-center justify-center w-full h-full">
          <Image
            src="/collabdesk white logo.png"
            alt="Workspace Dashboard"
            width={800}
            height={600}
            className="max-w-full h-auto w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%]"
          />
        </div>

        {showUserLogs && (
          <div
            className={`absolute rounded-[4px] top-0 right-8 h-[600px] w-[90%] sm:w-[400px] bg-gray-950 border-l shadow-lg flex flex-col 
              ${isMediumScreen ? 'text-only' : ''}`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium text-white">User Logs</h3>
              <button
                onClick={toggleUserLogs}
                className="p-1 rounded-full hover:bg-gray-700"
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            <div className="p-4 flex-grow">
              <p className="text-sm text-gray-400 mb-4">Recent user activity:</p>
              <ul className="space-y-2 min-h-[300px] max-h-[480px] overflow-y-auto custom-scrollbar">
                {userLogs && userLogs.length > 0 ? (
                  userLogs.map((log, index) => (
                    <li key={index} className="p-2 rounded text-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="block font-normal text-gray-400 text-[12px]">
                            {log.email}
                          </span>
                          <span
                            className={`block text-sm ${
                              isLargeScreen ? 'font-bold text-blue-400' : ''
                            }`}
                          >
                            {log.action}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 self-start">
                          {new Date(log.time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-400">No activity logs available</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}