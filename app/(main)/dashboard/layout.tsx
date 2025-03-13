"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LiveblocksProviderWrapper from "../../../components/Providers/LiveblocksProvider";
import Sidebar from "./sidebar";

 
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // const router = useRouter();
  // const [workspaces, setWorkspaces] = useState([]);
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // useEffect(() => {
  //   const fetchWorkspaces = async () => {
  //     try {
  //       const userFetch = localStorage.getItem("user");
  //       if (!userFetch) return;

  //       const userData = JSON.parse(userFetch);
  //       const response = await API.post(
  //         "/workspace/fetch",
  //         { userId: userData.id },
  //         { withCredentials: true }
  //       );

  //       if (response.data.workspace?.length > 0) {
  //         setWorkspaces(response.data.workspace);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching workspaces:", error);
  //     }
  //   };

  //   fetchWorkspaces();
  // }, [router]);

  const whiteboardPresent = pathname.startsWith('/dashboard/whiteboard');

  return (
    <LiveblocksProviderWrapper>
      <div className="flex h-screen bg-gray-900 overflow-hidden">
        {!whiteboardPresent && (
          <div
            className={`fixed top-0 left-0 h-full transition-all duration-300 z-10
              ${isSidebarOpen ? 'w-64' : 'w-16'}`}
          >
            <Sidebar onToggle={(isOpen) => setIsSidebarOpen(isOpen)} />
          </div>
        )}

        <main
          className={`flex-1 h-full overflow-auto transition-all duration-300
            ${!whiteboardPresent
              ? `${isSidebarOpen
                ? 'ml-64 w-[calc(100%-16rem)]'
                : 'ml-16 w-[calc(100%-4rem)]'}`
              : 'ml-0 w-full'
            }`}
        >
          {children}
        </main>
      </div>
    </LiveblocksProviderWrapper>
  );
}