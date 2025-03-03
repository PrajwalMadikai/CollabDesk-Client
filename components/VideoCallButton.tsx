import { useRouter } from 'next/navigation';
import React from 'react';

interface VideoCallButtonProps {
  workspaceId: string;
  userId: string;
  userName: string;
}

const VideoCallButton: React.FC<VideoCallButtonProps> = ({ workspaceId }) => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(`/conference/${workspaceId}`);
  };

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