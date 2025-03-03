import { VideoRoomHook } from '@/hooks/useVideoCall';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference
} from '@livekit/components-react';
import "@livekit/components-styles";
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface VideoProps {
  workspaceId: string;
  userId: string | null;
  userName: string | null;
}

const VideoCall: React.FC<VideoProps> = ({ workspaceId, userId, userName }) => {
  const router = useRouter();
  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  const {
    joinCall,
    endCall,
    token,
    error,
    setError,
    isInCall,
    isLoading,
  } = VideoRoomHook({ workspaceId, userId, userName });
  
  // Auto-join the call when component mounts
  useEffect(() => {
    joinCall();
  }, []);

  const leaveCall = () => {
    endCall();
    router.back();
  };

  useEffect(() => {
    if (!serverUrl) {
      setError('LiveKit server URL is not configured properly');
    }
  }, [serverUrl, setError]);

  // Add LiveKit custom styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .lk-video-conference {
        height: 100% !important;
        overflow: auto !important;
      }
      
      .lk-grid-layout {
        overflow-y: auto !important;
        max-height: calc(100vh - 80px) !important;
      }
      
      .lk-participant-tile {
        min-height: 200px !important;
      }
      
      .lk-control-bar {
        position: sticky !important;
        bottom: 0 !important;
        z-index: 10 !important;
        background-color: rgba(36, 36, 36, 0.9) !important;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Connecting to video call...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p>{error}</p>
          <button
            className="ml-2 px-3 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300 transition-colors"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }
 

  return (
    <div className="video-conferencing-container h-[calc(100vh-80px)] w-full flex flex-col overflow-hidden">
      {token && (
        <LiveKitRoom
          token={token}
          serverUrl={serverUrl}
          connectOptions={{ autoSubscribe: true }}
          onDisconnected={leaveCall}
          onError={(error) => {
            console.error('LiveKit connection error:', error);
            setError(`Connection error: ${error.message}`);
            endCall();
          }}
          className="h-full"
          data-lk-theme="default"
        >
          <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto">
              <VideoConference />
            </div>
          </div>
          <RoomAudioRenderer />
        </LiveKitRoom>
      )}
    </div>
  );
};

export default VideoCall;