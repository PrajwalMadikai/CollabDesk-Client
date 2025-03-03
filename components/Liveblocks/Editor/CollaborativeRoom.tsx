"use client";
import { RootState } from "@/store/store";
import { Layer } from "@/Types/canvas";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RoomProvider } from "../../../liveblocks.config";

interface RoomProps {
  children: ReactNode;
  roomId: string;
  fallback: NonNullable<ReactNode> | null;
}

export const CollaborativeRoom = ({ children, roomId, fallback }: RoomProps) => {
  if (!roomId) {
    return <div className="text-white text-2xl">Loading... (No Room ID)</div>;
  }
  const user=useSelector((state:RootState)=>state.user)

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,  
        selection: [], 
        pencilDraft: null, 
        penColor: null, 
        user:{
          name:user.fullname
        }
      }}
      initialStorage={{
        layers: new LiveMap<string, LiveObject<Layer>>(), 
        layerIds: new LiveList<string>([]),  
      }}
    >
      <ClientSideSuspense fallback={fallback}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};