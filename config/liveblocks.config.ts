"use client";

import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// Define presence for each user in the room
type Presence = {
  isTyping: boolean;
  userName?: string;
  cursor: { x: number; y: number } | null;
  user: {
    name: string;
  };
};

// Define storage structure
type Storage = {
  content: string;
  version: number;
};

export const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useOthers,
  useStorage,
  useMutation,
} = createRoomContext<Presence, Storage>(client);
