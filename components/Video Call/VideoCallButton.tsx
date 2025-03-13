import { useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import { VideoRoomHook } from '../../hooks/useVideoCall';
import { RootState } from '../../store/store';

interface VideoCallButtonProps {
  workspaceId: string;
}

const VideoCallButton: React.FC<VideoCallButtonProps> = ({ workspaceId }) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const {
    joinCall,
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

  return (<>
    <button onClick={handleButtonClick}>
     Start Video Call
    </button>
    </>
  );
};

export default VideoCallButton;