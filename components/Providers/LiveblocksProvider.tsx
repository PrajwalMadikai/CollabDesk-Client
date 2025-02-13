import { ClientSideSuspense, LiveblocksProvider } from "@liveblocks/react/suspense";
import { ReactNode, useEffect, useState } from "react";

const LiveblocksProviderWrapper = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  if (!authToken) {
    return <div className="text-white">Loading... waiting for authentication</div>;
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

          return await response.json();
        } catch (error) {
          console.error("Auth endpoint error:", error);
          throw error;
        }
      }}
    >
      <ClientSideSuspense fallback={<div>Loading...in client suspense liveblocks provider</div>}>
        {() => children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default LiveblocksProviderWrapper;