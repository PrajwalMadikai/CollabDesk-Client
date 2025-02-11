"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";
import { CollaborativeEditor } from "./CollaborativeTextEditor";

// ✅ Define metadata & user types
interface RoomMetadata {
  title: string;
  workspaceId: string;
}

interface User {
  id: string;
  name: string;
}

type UserType = "editor" | "viewer";  

// ✅ Ensure `roomId` is part of props
interface CollaborativeRoomProps {
  roomId: string;
  roomMetadata: RoomMetadata;
  users: User[];
  currentUserType: UserType;
  children?: ReactNode;
}

// ✅ Define the component correctly with React.FC<Props>
const CollaborativeRoom: React.FC<CollaborativeRoomProps> = ({
  roomId,
  roomMetadata,
  users,
  currentUserType,
  children
}) => {
  if (!roomId) return <div>Loading Liveblocks Room...</div>;

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<h1>Loading..........Room</h1>}>
        <div className="collaborative-room">
          <CollaborativeEditor  />
          {children}
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;
