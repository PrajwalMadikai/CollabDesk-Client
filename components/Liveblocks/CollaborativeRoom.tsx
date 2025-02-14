import { createClient, LiveObject } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { ClientSideSuspense, } from "@liveblocks/react/suspense";
import { ReactNode } from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { CollaborativeEditor } from "./CollaborativeTextEditor";
import { LiveCursors } from "./LiveCursor";

if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
  throw new Error("LIVEBLOCKS_SECRET_KEY is missing");
}

export const liveblocks = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
});

declare type Storage = {
  document: LiveObject<{ [key: string]: any }>; 
};

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

export const {
  RoomProvider,
  useStorage,
  useOthers,
  useSelf,
  useRoom,
  useMutation,
} = createRoomContext<Presence, Storage, UserMeta>(liveblocks);
interface RoomMetadata {
  title: string;
  workspaceId: string;
}

interface User {
  id: string;
  name: string;
}


interface CollaborativeRoomProps {
  roomId: string;
  roomMetadata: RoomMetadata;
  users: User[];
  children?: ReactNode;
}

const CollaborativeRoom: React.FC<CollaborativeRoomProps> = ({
  roomId,
  roomMetadata,
  users,
}) => {
  if (!roomId) return <LoadingSpinner/>
  return (
    <RoomProvider 
      id={roomId} 
      initialPresence={{
        cursor: null,
        selection: null,
        isTyping:false,
        lastActive:null
      }}
      initialStorage={{
        document: new LiveObject({ title: "Untitled Document", content: "" }),
      }}
    >
      <ClientSideSuspense fallback={<h1><LoadingSpinner/></h1>}>
        {() => (
          <div className="collaborative-room relative">
            <LiveCursors  />
            <CollaborativeEditor />
          </div>
        )}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;