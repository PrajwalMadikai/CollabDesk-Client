"use client";

import { ClientSideSuspense, LiveblocksProvider } from "@liveblocks/react/suspense";
import { ReactNode, useEffect, useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";

const LiveblocksProviderWrapper = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAuthToken(token);
    } else {
      console.error("No access token found in localStorage");
    }
  }, []);

  if (!authToken) {
    return <LoadingSpinner />;
  }

  return (
    <LiveblocksProvider
      authEndpoint={async () => {
        try {
          const response = await fetch("/api/liveblocks-auth", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
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