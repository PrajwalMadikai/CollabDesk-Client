import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";
import { LoadingSpinner } from "../LoadingSpinner"; // Ensure this import is correct
import { CollaborativeEditor } from "./CollaborativeTextEditor";
import { LiveCursors } from "./LiveCursor";
if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is missing");
}

export const liveblocks = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
});
declare type Storage = {
  document: Record<string, any>; // Serialized representation of Y.XmlFragment
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
  useStorage,
  useOthers,
  useSelf,
  useRoom,
  useMutation,
} = createRoomContext<Presence, Storage, UserMeta>(liveblocks);
// Define types
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
        // Define initial storage if needed
        document: {},
      }}
    >
      <ClientSideSuspense fallback={<LoadingSpinner />}>
        {() => (
          <div className="collaborative-room relative">
            <LiveCursors />
            <CollaborativeEditor roomId={roomId} />
            {children}
          </div>
        )}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;