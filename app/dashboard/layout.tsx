"use client";
import { API } from "@/app/api/handle-token-expire";
import LiveblocksProviderWrapper from "@/components/Providers/LiveblocksProvider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";

interface Workspace {
  workspaceId: string;
  workspaceName: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState([]);
  const pathname=usePathname()

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

    fetchWorkspaces();
  }, [router]);
  
   const whiteboardPresent=pathname.startsWith('/dashboard/whiteboard')

  return (
    <LiveblocksProviderWrapper>
      <div className="flex h-screen bg-gray-900">
       {  !whiteboardPresent && <Sidebar />  }

        <div  className={`flex-1 transition-all duration-300 *
        ${  !whiteboardPresent ? " md:ml-[255px]" : "ml-0"    }`}>
          {children}
        </div>
      </div>
    </LiveblocksProviderWrapper>
  );
}