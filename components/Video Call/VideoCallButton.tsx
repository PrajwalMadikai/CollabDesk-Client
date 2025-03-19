import { PhoneCall } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../components/ui/button";
import { VideoRoomHook } from "../../hooks/useVideoCall";
import { RootState } from "../../store/store";

interface VideoCallButtonProps {
  workspaceId: string;
}

const VideoCallButton: React.FC<VideoCallButtonProps> = ({ workspaceId }) => {

  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [isRinging, setIsRinging] = useState(false);

  const { joinCall, setError, participantCount } = VideoRoomHook({
    workspaceId,
    userId: user?.id || null,
    userName: user?.fullname || null,
  });

  useEffect(() => {
    setIsRinging(participantCount > 0);
  }, [participantCount]);

  const handleButtonClick = async () => {
    setError(null);
    await joinCall();
    router.push(`/conference/${workspaceId}`);
  };

  return (
    <div className="relative">
      {isRinging && <div className="absolute inset-0 rounded-full wave-effect"></div>}
      
      <Button
        onClick={handleButtonClick}
        className={`flex items-center gap-2 ${isRinging ? "ringing-button" : ""}`}
        variant="outline"
      >
        <PhoneCall size={16} />
        {isRinging ? <span>Join Call</span> : <span>Start Video Call</span>}
      </Button>
    </div>
  );
};

export default VideoCallButton;
