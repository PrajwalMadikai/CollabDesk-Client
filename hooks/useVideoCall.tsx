import { socket } from "@/components/Liveblocks/Editor/CollaborativeTextEditor";
import { useEffect, useRef, useState } from "react";
import { TokenGenerate } from "../services/VideocallApi";

interface HookProps {
  workspaceId: string;
  userName: string | null;
  userId: string | null;
}

export const VideoRoomHook = ({ workspaceId, userName, userId }: HookProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const isSubscribed = useRef(false);

  useEffect(() => {
    if (!isSubscribed.current) {
      // Subscribe to room when component mounts
      socket.emit('subscribeToRoom', workspaceId);
      isSubscribed.current = true;
    }

    // Listen for participant updates
    const handleParticipantUpdate = (data: { room: string; count: number }) => {
      if (data.room === workspaceId) {
        setParticipantCount(data.count);
      }
    };
    
    socket.on('participantUpdate', handleParticipantUpdate);

    return () => {
      socket.off('participantUpdate', handleParticipantUpdate);
    };
  }, [workspaceId]);

  // Handle component unmount
  useEffect(() => {
    return () => {
      if (isInCall) {
        socket.emit('leaveCall', workspaceId);
      }
    };
  }, [workspaceId, isInCall]);

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
    if (isInCall) {
      return token;  
    }
    const callToken = await getToken();
    if (callToken) {
      setIsInCall(true);
      socket.emit('joinCall', workspaceId);  
      return callToken;
    }
    return null;
  };

  const endCall = () => {
    if (isInCall) {
      socket.emit('leaveCall', workspaceId);  
      setIsInCall(false);
      setToken(null);
    }
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
    participantCount,
    setIsInCall,
  };
};