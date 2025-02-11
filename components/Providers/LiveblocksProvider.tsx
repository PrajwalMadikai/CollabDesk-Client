import { ClientSideSuspense, LiveblocksProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";

const LiveblocksProviderWrapper = ({ children }: { children: ReactNode;}) => {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth" throttle={500} >
      <ClientSideSuspense fallback={<div>Loading...in client suspense liveblocks provider</div>}>
        {children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default LiveblocksProviderWrapper;
