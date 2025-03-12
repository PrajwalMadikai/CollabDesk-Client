import { TokenGenerate } from "@/services/VideocallApi";
import { useState } from "react";

interface hookProps {
  workspaceId: string;
  userName: string | null;
  userId: string | null;
}

export const VideoRoomHook = ({ workspaceId, userName, userId }: hookProps) => {
  const [token, setToken] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
 
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

 

  return {
    getToken,
    joinCall,
    endCall,
    token,
    error,
    setError,
    isInCall,
    isLoading,
 
  };
};