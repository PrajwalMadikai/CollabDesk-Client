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

  const leaveCall = () => {
    endCall();
    router.back();
  };

  useEffect(() => {
    if (!serverUrl) {
      setError('LiveKit server URL is not configured properly');
    }
  }, [serverUrl, setError]);

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded mb-4">
        {error}
        <button
          className="ml-2 underline"
          onClick={() => setError(null)}
        >
          Dismiss
        </button>
      </div>
    );
  }

  if (!serverUrl) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded mb-4">
        Video call feature is not configured correctly.
      </div>
    );
  }

  return (
    <div className="video-conferencing-container">
      {!isInCall ? (
        <div className="text-center p-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={joinCall}
          >
            Join Video Call
          </button>
        </div>
      ) : (
        <div className="video-room h-full">
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
            >
              <VideoConference />
              <RoomAudioRenderer />
            </LiveKitRoom>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoCall;