import { VideoRoomHook } from '@/hooks/useVideoCall';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';

interface VideoCallButtonProps {
  workspaceId: string;
}

const VideoCallButton: React.FC<VideoCallButtonProps> = ({ workspaceId }) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const {
    joinCall,
    isLoading,
    error,
    setError,
    isCallActive,
    participantCount,
  } = VideoRoomHook({
    workspaceId,
    userId: user?.id || null,
    userName: user?.fullname || null,
  });

  const handleButtonClick = async () => {
    setError(null);  
    await joinCall();  
    router.push(`/conference/${workspaceId}`);  
  };

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

  return (
    <button
      className={`
        relative border px-4 py-2 rounded
        ${isCallActive 
          ? 'bg-red-600 text-white hover:bg-red-700' 
          : 'bg-green-600 text-white hover:bg-green-700'}
      `}
      onClick={handleButtonClick}
    >
      {isCallActive && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
      {isCallActive 
        ? `Join Video Call (${participantCount} active)` 
        : 'Start Video Call'}
    </button>
  );
};

export default VideoCallButton;