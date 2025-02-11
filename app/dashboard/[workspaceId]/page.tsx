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
      <div>Workspace Dashboard Content</div>
    </CollaborativeRoom>
  );
}
