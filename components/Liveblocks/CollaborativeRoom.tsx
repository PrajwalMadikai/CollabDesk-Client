import { Block as CoreBlock } from "@blocknote/core";
import { createClient, LiveList, } from "@liveblocks/client";
import { RoomProvider } from "@liveblocks/react";
import { ClientSideSuspense } from "@liveblocks/react/suspense";
import { ReactNode } from "react";
import { LoadingSpinner } from "../LoadingSpinner";

if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is missing");
}
type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? Mutable<T[P]> : T[P];
};

type Block = Mutable<CoreBlock> & {
  [key: string]: any; // Add an index signature to satisfy LsonObject
};
export const liveblocks = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
});
 
declare type Presence = {
  cursor: { x: number; y: number } | null;
  selection: any;
  isTyping: boolean;
  lastActive: number | null;
};

declare type UserMeta = {
  id: string;
  info: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    color: string;
  };
};
 
 

interface CollaborativeRoomProps {
  roomId: string;
  children?: ReactNode;
}

export const CollaborativeRoom: React.FC<CollaborativeRoomProps> = ({
  roomId,
  children,
}) => {
  if (!roomId) {
    return <div className="text-white text-2xl">Loading... (No Room ID)</div>;
  }

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        selection: null,
        isTyping: false,
      }}
      initialStorage={{
        document: new LiveList<Block>([]), // Initialize with an empty LiveList
      }}
    >
      <ClientSideSuspense fallback={<LoadingSpinner />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};