"use client";
import { Layer } from "@/Types/canvas";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { ReactNode } from "react";
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

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null, // Tracks the user's cursor position
        selection: [], // Tracks selected layer IDs
        pencilDraft: null, // Tracks pencil draft data
        penColor: null, // Tracks the pen color
      }}
      initialStorage={{
        layers: new LiveMap<string, LiveObject<Layer>>(), // A map of layers in the canvas
        layerIds: new LiveList<string>([]), // A list of layer IDs to maintain order
      }}
    >
      {/* Use ClientSideSuspense to handle loading states */}
      <ClientSideSuspense fallback={fallback}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};