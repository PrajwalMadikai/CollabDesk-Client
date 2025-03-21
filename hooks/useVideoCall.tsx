import { useState } from "react";
import { TokenGenerate } from "../services/VideocallApi";

interface hookProps {
  workspaceId: string;
  userName: string | null;
  userId: string | null;
}

export const VideoRoomHook = ({ workspaceId, userName, userId }: hookProps) => {
  const [token, setToken] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(0);

  const getToken = async () => {
    try {
      setIsLoading(true);
      const response = await TokenGenerate(workspaceId, userName, userId);
      if (response?.token) {
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

  // useEffect(() => {
  //   const fetchParticipants = async () => {
  //     try {
  //       const response = await GetVideocallParticipants(workspaceId);
        
  //       setParticipantCount(response.count);
  //     } catch (error) {
  //       console.error("Failed to fetch participants:", error);
  //     }
  //   };

  //   fetchParticipants();
  //   const interval = setInterval(fetchParticipants, 5000); 

  //   return () => clearInterval(interval);
  // }, [workspaceId]);

  return {
    getToken,
    joinCall,
    endCall,
    token,
    error,
    setError,
    isInCall,
    isLoading,
    participantCount,
    setIsInCall
  };
};
