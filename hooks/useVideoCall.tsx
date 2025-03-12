import { TokenGenerate } from "@/services/VideocallApi";
import { RoomServiceClient } from "livekit-server-sdk";
import { useEffect, useState } from "react";

interface hookProps{
    workspaceId:string,
    userName:string|null,
    userId:string|null
}

export const VideoRoomHook=({workspaceId,userName,userId}:hookProps)=>{
    const [token, setToken] = useState(null);
    const [isInCall, setIsInCall] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string|null>(null);
    const [participantCount, setParticipantCount] = useState(0);
    const [isCallActive, setIsCallActive] = useState(false);

    const getToken = async () => {
        try {
          setIsLoading(true);
          const response = await TokenGenerate(workspaceId, userName, userId);
      
          if (response && response.token) {
            setToken(response.token);
            return response.token;
          } else {
            throw new Error("Invalid response format");
          }
        } catch (error) {
          console.error("Error getting token:", error);
          setError(error instanceof Error ? error.message : "Failed to get access token");
          return null;
        } finally {
          setIsLoading(false);
        }
      };
    const joinCall = async () => {
        setError(null);
        
        const callToken = await getToken();
        if (callToken) {
          setIsInCall(true);
        }
    };

    const endCall = () => {
        setIsInCall(false);
        setToken(null);
      };
      const checkParticipants = async () => {
        try {
          const apiKey = process.env.NEXT_PUBLIC_LIVEKIT_API_KEY;
          const apiSecret = process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET;
          const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
          
          
          if (!apiKey || !apiSecret || !livekitUrl) {
            console.error('LiveKit configuration missing');
            return;
          }
          
          const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret);
          const roomInfo = await roomService.listRooms();
          
          const room = roomInfo.find(r => r.name === workspaceId);
          console.log('room info:',room);
          
          if (room) {
            setParticipantCount(room.numParticipants);
            setIsCallActive(room.numParticipants > 0);
          } else {
            setParticipantCount(0);
            setIsCallActive(false);
          }
        } catch (error) {
          console.error('Error checking room participants:', error);
        }
      };
      useEffect(() => {
        checkParticipants();
        const interval = setInterval(checkParticipants, 5000);  
        
        return () => clearInterval(interval);
      }, [workspaceId]);

      return{
        getToken,
        joinCall,
        endCall,
        token,
        error,
        setError,
        isInCall,
        isLoading,
        participantCount,
        isCallActive,
      }
}