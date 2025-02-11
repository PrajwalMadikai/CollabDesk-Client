"use client";
import { API } from "@/app/api/handle-token-expire";
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
  const [liveblocksToken, setLiveblocksToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const userFetch = localStorage.getItem("user");
        if (!userFetch) return;

        const userData = JSON.parse(userFetch);
        const response = await API.post(
          "/workspace/fetch", 
          { userId: userData.id }, 
          { withCredentials: true }
        );

        if (response.data.workspace?.length > 0) {
          setWorkspaces(response.data.workspace);
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    const initializeLiveblocks = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        console.log("Retrieved token:", token ? "Token exists" : "No token"); // Debug log
    
        if (!token) {
          console.error("No access token found in localStorage");
          // Redirect to login or handle the missing token case
          router.push("/login");
          return;
        }
    
        const response = await fetch("/api/liveblocks-auth", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
    
        console.log("Liveblocks auth response status:", response.status);
    
        if (!response.ok) {
          throw new Error("Failed to authenticate with Liveblocks");
        }
    
        const data = await response.json();
        setLiveblocksToken(data.token);
      } catch (error) {
        console.error("Error initializing Liveblocks:", error);
        // Handle the error (e.g., redirect to login or show a message)
        router.push("/login");
      }
    };

    fetchWorkspaces().then(()=>{ initializeLiveblocks()})
   
  }, [router]);

  return (
    <LiveblocksProviderWrapper>
      <div className="flex h-screen bg-black">
        <Sidebar workspaces={workspaces} />
        <main className="flex-1 p-6 w-full sm:ml-64 overflow-auto">
          {children}
        </main>
      </div>
    </LiveblocksProviderWrapper>
  );
}
