"use client";
import CollaborativeRoom from "@/components/Liveblocks/CollaborativeRoom";
import { CollaborativeEditor } from "@/components/Liveblocks/CollaborativeTextEditor";
import { useParams } from "next/navigation";
export default function FileEditor() {
  const { workspaceId , fileId } = useParams()  as { workspaceId: string; fileId: string };

  return (
    <CollaborativeRoom
      roomId={`${workspaceId}-${fileId}`}
      roomMetadata={{
        title: "File Editor",
        workspaceId ,
      }}
      users={[]}
      currentUserType="editor"
    >
      <CollaborativeEditor  />
    </CollaborativeRoom>
  );
}