"use client";

import { connectionIdToColor } from "@/lib/utils";
import { useOthers, useSelf } from "@/liveblocks.config";
import { UserAvatar } from "./user-avatar";

const MAX_SHOWN_USERS = 2;

export const Participants = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > MAX_SHOWN_USERS;

  return (
    <div className="absolute h-12 z-[99999] top-2 right-2 bg-black rounded-md p-3 flex items-center shadow-md">
      <div className="flex gap-x-2">
        {users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, presence }) => {
          const user = presence?.user;  
          return (
            <UserAvatar
              key={connectionId}
              borderColor={connectionIdToColor(connectionId)}
              src={user?.avatar }  
              name={user?.name }
              fallback={user?.name?.[0] || "T"}
            />
          );
        })}

        {currentUser && (
          <UserAvatar
            borderColor={connectionIdToColor(currentUser.connectionId)}
            src={currentUser.presence?.user?.avatar  } // Fallback avatar
            name={`${currentUser.presence?.user?.name} (You)`}
            fallback={currentUser.presence?.user?.name?.[0] || "T"}
          />
        )}

        {/* Show "+X" if there are more users */}
        {hasMoreUsers && (
          <UserAvatar
            name={`${users.length - MAX_SHOWN_USERS} more`}
            fallback={`+${users.length - MAX_SHOWN_USERS}`}
          />
        )}
      </div>
    </div>
  );
};

export const ParticipantsSkeleton = () => {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md w-[100px]" />
  );
};