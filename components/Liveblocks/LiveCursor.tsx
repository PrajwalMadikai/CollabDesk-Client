import { useOthers, useUpdateMyPresence } from "@liveblocks/react";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
}

export interface Presence {
  cursor: { x: number; y: number } | null;
}

interface CursorProps {
    cursor?: { x: number; y: number } | null;  
    userInfo?: UserInfo;
  }
const Cursor: React.FC<CursorProps> = ({ cursor, userInfo }) => (
    <div
    className="absolute pointer-events-none"
    style={{
      left: cursor?.x,
      top: cursor?.y,
      transform: 'translateX(-50%) translateY(-50%)'
    }}
  >
    <div
      className="rounded-full"
      style={{
        width: "10px",
        height: "10px",
        backgroundColor: userInfo?.color || "red",
      }}
    />
    {userInfo?.name && (
      <div 
        className="absolute left-4 top-0 px-2 py-1 rounded text-sm text-white"
        style={{ backgroundColor: userInfo.color || "red" }}
      >
        {userInfo.name}
      </div>
    )}
  </div>
);

export function LiveCursors() {
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();

  return (
    <div
      className="relative h-full w-full"
      onPointerMove={(event) => {
        updateMyPresence({
          cursor: {
            x: event.clientX,
            y: event.clientY,
          },
        });
      }}
      onPointerLeave={() => {
        updateMyPresence({
          cursor: null,
        });
      }}
    >
      {others.map((user) => {
        if (!user.presence?.cursor) return null;

        return (
          <Cursor 
            key={user.connectionId} 
            // cursor={user.presence.cursor}
            // userInfo={user.info}
          />
        );
      })}
    </div>
  );
}