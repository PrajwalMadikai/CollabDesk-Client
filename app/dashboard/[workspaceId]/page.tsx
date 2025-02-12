"use client";
import CollaborativeRoom from "@/components/Liveblocks/CollaborativeRoom";
import { useParams } from "next/navigation";

export default function WorkspaceDashboard() {
  const { workspaceId } = useParams();

  return (
    <CollaborativeRoom
      roomId={workspaceId as string}
      roomMetadata={{
        title: "Workspace Dashboard",
        workspaceId: workspaceId as string
      }}
      users={[]}
      currentUserType="editor"
    >
      <div className="flex items-center justify-center h-screen">
        <img 
          src="/collabdesk white logo.png" 
          alt="Workspace Dashboard" 
          className="max-w-full h-auto w-[80%] md:w-[50%] lg:w-[40%]"
        />
      </div>
    </CollaborativeRoom>
  );
}
