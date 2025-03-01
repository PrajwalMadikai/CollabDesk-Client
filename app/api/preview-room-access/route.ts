import { liveblocks } from "@/lib/liveblocks-server";
import { NextRequest, NextResponse } from "next/server";

const processedRooms = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId } = body;
    
    if (!roomId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (processedRooms.has(roomId)) {
      return NextResponse.json({ success: true, cached: true }, { status: 200 });
    }

    try {
      const room = await liveblocks.getRoom(roomId);
      
      await liveblocks.updateRoom(roomId, {
        defaultAccesses: ["room:read", "room:presence:write"],  
      });
      
      processedRooms.add(roomId);
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (roomError) {
      const newRoom = await liveblocks.createRoom(roomId, {
        defaultAccesses: ["room:read", "room:presence:write"], 
      });

      processedRooms.add(roomId);
      console.log("Room created with read-only access for anonymous users");
      return NextResponse.json({ success: true, room: newRoom }, { status: 200 });
    }
  } catch (error) {
    console.error("Error managing room access:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}