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

  const { joinCall, setError, participantCount,getToken,setIsInCall} = VideoRoomHook({
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
    <div className="relative">
      {isRinging && <div className="absolute inset-0 rounded-full wave-effect"></div>}
      
      <Button
        onClick={handleButtonClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition duration-200 ${
          isRinging ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        <PhoneCall size={16} />
        {isRinging ? <span>Join Call</span> : <span>Start Video Call</span>}
      </Button>
    </div>
  );
};

export default VideoCallButton;