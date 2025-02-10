"use client";
import { API } from "@/api/handle-token-expire";
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

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const userFetch = localStorage.getItem("user");
        if (!userFetch) return;

        const userData = JSON.parse(userFetch);
        const response = await API.post("/workspace/fetch", { userId: userData.id }, { withCredentials: true });

        if (response.data.workspace && response.data.workspace.length > 0) {
          setWorkspaces(response.data.workspace);
          router.replace(`/dashboard/${response.data.workspace[0].workspaceId}`);
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    fetchWorkspaces();
  }, [router]);

  return (
    <div className="flex h-screen bg-black">
      <Sidebar workspaces={workspaces} />
      <div className="flex-1 p-6 w-full sm:ml-64 overflow-auto">{children}</div>
    </div>
  );
}
