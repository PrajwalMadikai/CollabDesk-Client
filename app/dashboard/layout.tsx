"use client";
import { API } from "@/api/handle-token-expire";
import CollaborativeRoom from "@/components/Liveblocks/CollaborativeRoom";
import LiveblocksProviderWrapper from "@/components/Providers/LiveblocksProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";

interface Workspace {
  workspaceId: string;
  workspaceName: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [liveblocksToken,setLiveblocksToken]=useState(null)

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const userFetch = localStorage.getItem("user");
        if (!userFetch) return;

        const userData = JSON.parse(userFetch);
        const response = await API.post("/workspace/fetch", { userId: userData.id }, { withCredentials: true });

        if (response.data.workspace && response.data.workspace.length > 0) {
          setWorkspaces(response.data.workspace);
          setSelectedWorkspace(response.data.workspace[0]); // Fix here
          router.replace(`/dashboard/${response.data.workspace[0].workspaceId}`);
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };
    
    const fetchLiveblocksToken = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const response = await fetch("/api/liveblocks-auth", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to authenticate with Liveblocks");

        const data = await response.json();
        setLiveblocksToken(data.token);
      } catch (error) {
        console.error("Error fetching Liveblocks token:", error);
      }
    };
   

    fetchWorkspaces().then(()=>{fetchLiveblocksToken()})
  }, [router]);

  return (
    <LiveblocksProviderWrapper token={liveblocksToken}>
      <div className="flex h-screen bg-black">
        <Sidebar workspaces={workspaces} />
        <div className="flex-1 p-6 w-full sm:ml-64 overflow-auto">
          {selectedWorkspace ? (
            <CollaborativeRoom
              roomId={selectedWorkspace.workspaceId}
              roomMetadata={{
                title: selectedWorkspace.workspaceName,
                workspaceId: selectedWorkspace.workspaceId
              }}
              users={[]} // Add your users here
              currentUserType="editor" // Or whatever type is appropriate
              
            >
              {children}
            </CollaborativeRoom>
          ) : (
            children
          )}
        </div>
      </div>
    </LiveblocksProviderWrapper>
  );
}
