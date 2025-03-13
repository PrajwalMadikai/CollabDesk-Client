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
    isLoading,
  } = VideoRoomHook({ workspaceId, userId, userName });
  
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
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-gray-100 rounded-lg shadow">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Connecting to video call...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-red-50 rounded-lg shadow max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {token && (
        <LiveKitRoom
          token={token}
          serverUrl={serverUrl}
          onDisconnected={leaveCall}
          onError={(error) => {
            console.error('LiveKit connection error:', error);
            setError(`Connection error: ${error.message}`);
            endCall();
          }}
          className="h-full"
          data-lk-theme="default"
        >
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-auto">
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