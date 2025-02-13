import { createClient } from "@liveblocks/client";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";
import { CollaborativeEditor } from "./CollaborativeTextEditor";
import { LiveCursors } from "./LiveCursor";

// interface Presence {
//   cursor: { x: number; y: number } | null;
//   selection: any | null;
// }

if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
  throw new Error("LIVEBLOCKS_SECRET_KEY is missing");
}

export const liveblocks = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
});

interface RoomMetadata {
  title: string;
  workspaceId: string;
}

interface User {
  id: string;
  name: string;
}

type UserType = "editor" | "viewer";  

interface CollaborativeRoomProps {
  roomId: string;
  roomMetadata: RoomMetadata;
  users: User[];
  currentUserType: UserType;
  children?: ReactNode;
}

const CollaborativeRoom: React.FC<CollaborativeRoomProps> = ({
  roomId,
  roomMetadata,
  users,
  currentUserType,
  children
}) => {
  if (!roomId) return <div className="text-white text-2xl">Loading Liveblocks no Room id...</div>;

  return (
    <RoomProvider 
      id={roomId} 
      initialPresence={{
        cursor: null,
        selection: null,
      }}
      initialStorage={{}}
    >
      <ClientSideSuspense fallback={<h1>Loading..........Room</h1>}>
        {() => (
          <div className="collaborative-room relative">
            <LiveCursors />
            <CollaborativeEditor />
            {children}
          </div>
        )}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;