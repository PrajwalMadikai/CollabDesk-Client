import { ClientSideSuspense, LiveblocksProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";

const LiveblocksProviderWrapper = ({ children, token }: { children: ReactNode; token: string | null }) => {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth" initialAuth={{ token }}>
      <ClientSideSuspense fallback={<div>Loading...in client suspense liveblocks provider</div>}>
        {children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default LiveblocksProviderWrapper;
