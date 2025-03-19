"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LiveblocksProviderWrapper from "../../../components/Providers/LiveblocksProvider";
import Sidebar from "./sidebar";

 
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
 
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
 
 console.log(setIsSidebarOpen)

  const whiteboardPresent = pathname.startsWith('/dashboard/whiteboard');

  return (
    <LiveblocksProviderWrapper>
      <div className="flex h-screen bg-gray-900 overflow-hidden">
        {!whiteboardPresent && (
          <div
            className={`fixed top-0 left-0 h-full transition-all duration-300 z-10
              ${isSidebarOpen ? 'w-64' : 'w-16'}`}
          >
            <Sidebar   />
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