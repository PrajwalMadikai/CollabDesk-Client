"use client";
import { API } from "@/app/api/handle-token-expire";
import CollaborativeRoom from "@/components/Liveblocks/CollaborativeRoom";
import { CollaborativeEditor } from "@/components/Liveblocks/CollaborativeTextEditor";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FileData {
  id: string;
  name: string;
}

export default function FileEditor() {
  const { workspaceId, fileId } = useParams() as { workspaceId: string; fileId: string };
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await API.get(`/file/${fileId}`, { withCredentials: true });
        setFileData(response.data.file);
      } catch (error) {
        console.error("Error fetching file data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (fileId) {
      fetchFileData();
    }
  }, [fileId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading file...</div>;
  }

  

  return (
    <CollaborativeRoom
      roomId={fileId}
      roomMetadata={{
        title: "untitled",
        workspaceId: workspaceId
      }}
      users={[]} // You'll need to implement user management
      currentUserType="editor"
    >
      <div className="h-screen bg-white">
        <CollaborativeEditor />
      </div>
    </CollaborativeRoom>
  );
}