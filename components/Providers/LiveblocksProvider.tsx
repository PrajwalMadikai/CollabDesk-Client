"use client";

import { ClientSideSuspense, LiveblocksProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";
import { LoadingSpinner } from "../LoadingSpinner";

const LiveblocksProviderWrapper = ({ children }: { children: ReactNode }) => {

  const token = localStorage.getItem("accessToken");
   

  if (!token) {
    return <LoadingSpinner />;
  }

  return (
    <LiveblocksProvider
      authEndpoint={async () => {
      console.log('auth wrapper calling');

        try {
          const response = await fetch("/api/liveblocks-auth", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Failed to authenticate with Liveblocks");
          }

          const result = await response.json();
          console.log("Liveblocks auth response:", result);  
          return result;
        } catch (error) {
          console.error("Auth endpoint error:", error);
          throw error;
        }
      }}
    >
      <ClientSideSuspense fallback={<LoadingSpinner />}>
        {() => children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default LiveblocksProviderWrapper;