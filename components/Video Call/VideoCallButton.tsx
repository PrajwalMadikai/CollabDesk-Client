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

  const { joinCall, setError, participantCount, getToken, setIsInCall } = VideoRoomHook({
    workspaceId,
    userId: user?.id || null,
    userName: user?.fullname || null,
  });

  useEffect(() => {
    setIsRinging(participantCount > 0);
  }, [participantCount]);

  const handleButtonClick = async () => {
    setError(null);

    if (isRinging) {
      // If participants are already in the call, join the call
      await joinCall();
    } else {
      // Otherwise, start a new video call
      const callToken = await getToken();
      if (callToken) {
        setIsInCall(true);
      }
    }

    router.push(`/conference/${workspaceId}`);
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {isRinging && (
        <>
          <span className="absolute animate-ping-slow opacity-75 h-full w-full rounded-full bg-blue-400"></span>
          <span className="absolute animate-ping-slower opacity-50 h-full w-full rounded-full bg-blue-300"></span>
        </>
      )}
      <Button
        onClick={handleButtonClick}
        className={`relative rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 ${
          isRinging 
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/50" 
            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
        }`}
        title={isRinging ? "Join Call" : "Start Video Call"}
      >
        <PhoneCall size={20} className={isRinging ? "animate-pulse" : ""} />
      </Button>
    </div>
  );
};

export default VideoCallButton;