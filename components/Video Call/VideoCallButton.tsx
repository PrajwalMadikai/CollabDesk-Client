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

  return (
    <button
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      onClick={handleButtonClick}
    >
      Start Video Call
    </button>
  );
};

export default VideoCallButton;