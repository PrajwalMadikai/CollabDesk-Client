  import { API } from "@/app/api/handle-token-expire";
import { useOthers, useRoom } from "@liveblocks/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

  interface FileData {
    id: string;
    name: string;
    content?: string;
  }

  interface User {
    name: string;
    color: string;
  }

  export default function FileEditor() {
    const { workspaceId, fileId } = useParams() as { workspaceId: string; fileId: string };
    const [fileData, setFileData] = useState<FileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    const currentUser: User = JSON.parse(localStorage.getItem("user")||"");
    const user = currentUser
    
    useEffect(() => {
      const fetchFileData = async () => {
        if (!fileId) return;
        
        try {
          setLoading(true);
          const response = await API.get(`/file/${fileId}`, { withCredentials: true });
          setFileData(response.data.file);
        } catch (error) {
          console.error("Error fetching file data:", error);
          setError("Failed to load file data");
        } finally {
          setLoading(false);
        }
      };

      fetchFileData();
    }, [fileId]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
          <div className="text-red-500">{error}</div>
        </div>
      );
    }

    return (
      <div className="h-screen bg-gray-900">
        <div className="h-full">
          <CollaborativeRoom
            roomId={fileId}
            initialPresence={{
              cursor: null,
              selection: null,
              firstName: user.name,
              color: user.color,
            }}
          >
            <EditorContainer fileData={fileData} />
          </CollaborativeRoom>
        </div>
      </div>
    );
  }

  interface EditorContainerProps {
    fileData: FileData | null;
  }

  function EditorContainer({ fileData }: EditorContainerProps) {
    const others = useOthers();
    const room = useRoom();

    useEffect(() => {
      // You can handle real-time presence updates here
      // const unsubscribe = room.subscribe("presence", () => {
      //   // Handle presence updates
      // });

      // return () => unsubscribe();
    }, [room]);

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
          <h1 className="text-white text-lg font-medium">
            {fileData?.name || "Untitled"}
          </h1>
          <div className="flex items-center space-x-2">
            {others.map(({ connectionId, presence }) => (
              <div
                key={connectionId}
                className="flex items-center space-x-1"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor:  'red' }}
                />
                <span className="text-sm text-gray-300">
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {/* <CollaborativeEditor
            initialContent={fileData?.content || ""}
            onContentChange={(content) => {
              // Handle content change if needed
            }}
          /> */}
        </div>
      </div>
    );
  }

  interface CollaborativeRoomProps {
    children: React.ReactNode;
    roomId: string;
    initialPresence: {
      cursor: null;
      selection: null;
      firstName: string;
      color: string;
    };
  }

  function CollaborativeRoom({ children, roomId, initialPresence }: CollaborativeRoomProps) {
    return (
      <div className="h-full">
        {children}
      </div>
    );
  }